import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {CdkDragDrop, CdkDropList, CdkDrag, moveItemInArray, CdkDragHandle} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

interface Player {
  active: boolean,
  profilepicture: string,
  steamid: string,
  adr: string,
  hltv_rating: string,
  kda: string,
  bias: string,
  elo: string,
  team: number,
  name: string,
}

interface TeamSelection {
  team1: Player[],
  team2: Player[],
  elodiff: number
}

interface Match {
  selection: TeamSelection,
  rank: number
}

type ApiResponse = any

const storageKey : string = "megaprism.csmatchmaker.players"

@Component({
  selector: 'app-csmatchmaker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    MatProgressSpinnerModule
  ],
  templateUrl: './csmatchmaker.component.html',
  styleUrl: './csmatchmaker.component.scss'
})
export class CSMatchmakerComponent implements OnDestroy {
  active_players = 0
  username = ""
  password = ""
  players: Player[] = []
  steamids_to_update: string[] = []
  defaultProfilePicture = "https://avatars.cloudflare.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg";

  private shouldStop = false;
  private isProcessing = false;
  private processed_steamid : string | null =  null

  ngOnDestroy() {
    this.shouldStop = true;
  }

  constructor(activatedRoute: ActivatedRoute, private http: HttpClient) {
    let players_storage = localStorage.getItem(storageKey);
    if(players_storage !== undefined && players_storage !== null) {
      this.players = JSON.parse(players_storage)
    }

    activatedRoute.paramMap.subscribe(params => {
      this.password = params.get("password") ?? ""
      this.username = params.get("username") ?? ""
    })
    if(this.players.length == 0) {
      this.add_player()
    }
    this.update_active_players()
    this.startBackgroundProcessor();
  }

  ngAfterViewInit() {
    this.update_team_info()
  }

  isLoading(id: string): boolean {
    return this.processed_steamid === id || this.steamids_to_update.includes(id);
  }

  store_playerslist() {
    localStorage.setItem(storageKey, JSON.stringify(this.players));
  }

  add_player() {
    this.players.push({
      active: false,
      profilepicture: this.defaultProfilePicture,
      steamid: "",
      name: "",
      kda: "",
      adr: "",
      hltv_rating: "",
      bias: "1.0",
      elo: "",
      team: 0,
    })
  }

  update_active_players() {
    this.active_players = this.players.filter(player => player.active).length
  }


  private startBackgroundProcessor() {
    (async () => {
      while (!this.shouldStop) {
        let delay = 250
        if (!this.isProcessing) {
          const item = this.steamids_to_update.shift(); // Always take the first element
          this.isProcessing = true;
          if(item !== undefined) {
            this.processed_steamid = item
            await this.processItem(item);
            this.processed_steamid = null
            delay = 50
          }
          this.isProcessing = false;
        }
        await this.delay(delay); // delay to avoid tight loop
      }
    })();
  }

  private async processItem(steamid: string) {
    let response = await firstValueFrom(this.http.post<ApiResponse>("https://csstats.mega-prism.com/api/csstats/playerStats", { steamIds: [steamid] }, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        'Authorization': 'Basic ' + btoa(this.username + ':' + this.password)
      }
    }))
    for(let key of Object.keys(response)) {
      let val = response[key];
      let player = this.players.find(player => player.steamid === key);
      if(player !== undefined) {
        player.adr = val?.adr ?? "";
        player.hltv_rating = val?.hltvRating ?? "";
        player.kda = val?.kd ?? "";
        if(player.name.trim() === "") {
          player.name = val?.steamName ?? "";
        }
        player.profilepicture = val?.profileImageUrl;
        this.update_elo(player);
      }
    }
    this.store_playerslist();
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  update() {
    let players_active_first = [...this.players].sort((p1, p2) => {
      // @ts-ignore: TS7015
      return p1.active > p2.active ? -1 : (p1.active < p2.active ? 1 : 0);
    })
    this.steamids_to_update = players_active_first.map(player => player.steamid)
  }

  update_elo(player: Player) {
    let kda = parseFloat(player.kda);
    let adr = parseFloat(player.adr);
    let hltv_rating = parseFloat(player.hltv_rating);
    let bias = parseFloat(player.bias);
    player.elo = ((kda + hltv_rating + bias) * adr).toFixed(2);
    this.store_playerslist();
  }

  calculate_teams() {
    let match = this.matchmaking(this.players.filter(player => player.active))
    for(let player of this.players) {
      player.team = 0
    }
    for(let player of match.selection.team1) {
      player.team = 1
    }
    for(let player of match.selection.team2) {
      player.team = 2
    }
    this.update_team_info(match);
    this.store_playerslist();
  }

  copy_team_text() {
    let team_text = "Team 1:\n"
    for(let player of this.players.filter(p => p.team === 1)) {
      team_text += player.name;
      team_text += "\n";
    }
    team_text += "Team 2:\n"
    for(let player of this.players.filter(p => p.team === 2)) {
      team_text += player.name;
      team_text += "\n";
    }
    navigator.clipboard.writeText(team_text);
  }

  update_team_info(match: Match | null = null) {
    let team1_elo = this.sum(this.players.filter(p => p.team == 1).map(p => Number.parseFloat(p.elo)))
    let team1_text = "Team 1: " + team1_elo.toFixed(2) + " Elo"
    document.getElementById("teams-team1")!!.textContent = team1_text;
    let team2_elo = this.sum(this.players.filter(p => p.team == 2).map(p => Number.parseFloat(p.elo)))
    let team2_text = "Team 2: " + team2_elo.toFixed(2) + " Elo"
    document.getElementById("teams-team2")!!.textContent = team2_text;
    let diff = Math.abs(team1_elo - team2_elo)
    let diff_percent = Math.max(team1_elo, team2_elo) / Math.min(team1_elo, team2_elo)
    let diff_text = "Diff: " + diff.toFixed(2) + " (" + diff_percent.toFixed(0) + "%) "
    if(match !== null) {
      if(match.rank === 0) {
        diff_text += "*best match*"
      } else {
        diff_text += "match rank: " + (match.rank + 1)
      }
    }
    document.getElementById("teams-diff")!!.textContent = diff_text;
  }

  sum(array: number[]) : number {
    return array.reduce((partialSum, a) => partialSum + a, 0);
  }

  getRandomInt(max: number) : number {
    return Math.floor(Math.random() * max);
  }

  matchmaking(players: Player[]) : Match {
    const MAX_MATCHES_TO_CONSIDER = 10
    let active_players = players.filter(p => p.active)
    let best_matches = this.findBestMatches(active_players, MAX_MATCHES_TO_CONSIDER)
    let idx = this.getRandomInt(MAX_MATCHES_TO_CONSIDER)
    let best_match = best_matches[idx]
    return { selection: best_match, rank: idx }
  }

  generateCombinations<T>(array: T[], size: number): T[][] {
    if (size === 0) return [[]];
    if (array.length === 0) return [];
    const [first, ...rest] = array;
    const withFirst = this.generateCombinations(rest, size - 1).map((comb) => [first, ...comb]);
    const withoutFirst = this.generateCombinations(rest, size);
    return [...withFirst, ...withoutFirst];
  }

  calculateTeamScore(team: Player[]): number {
    return team.reduce((score, player) => score + Number.parseFloat(player.elo), 0);
  }

  findBestMatches(players: Player[], count: number): TeamSelection[] {
    const n = players.length;
    const teamSize = Math.floor(n / 2);

    const allCombinations = this.generateCombinations(players, teamSize);
    let bestMatches : TeamSelection[] = [];

    for (const team1 of allCombinations) {
      const team2 = players.filter((player) => !team1.includes(player)); // Remaining players
      const score1 = this.calculateTeamScore(team1);
      const score2 = this.calculateTeamScore(team2);
      const elodiff = Math.abs(score1 - score2);

      if (bestMatches.length < count) {
        bestMatches.push({ team1, team2, elodiff });
        bestMatches.sort((a, b) => a.elodiff - b.elodiff)
      } else if(bestMatches[bestMatches.length - 1].elodiff > elodiff) {
        for(let i = 0; i < bestMatches.length; i++) {
          if(bestMatches[i].elodiff > elodiff ) {
            bestMatches.splice(i, 0, { team1, team2, elodiff })
            break;
          }
        }
      }
      bestMatches.splice(count)
    }

    return bestMatches;
  }

  permutations(players: Player[]) : Player[][] {
    let result: Player[][] = [];
    const permute = (arr: Player[], m : Player[] = []) => {
      if (arr.length === 0) {
        result.push(m)
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice();
          let next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next))
        }
      }
    }
    permute(players)
    return result;
  }

  open_csstats(player: Player) {
    open("https://csstats.gg/player/" + player.steamid)
  }

  export_data() {
    let a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(this.players)], {type: "text/json"}));
    a.download = "csmatchmaker.json"
    a.click();
    URL.revokeObjectURL(a.href);
  }

  import_data(){
    let i = document.createElement("input")
    i.type = "file";
    i.click();
    i.onchange = (e) => {
      let file = (e.target as HTMLInputElement).files?.[0]
      file?.text().then(json => this.players = JSON.parse(json))
      this.store_playerslist();
      this.update_team_info();
      this.update_active_players();
    }
  }

  orderby(key: string) {
    let new_order = [...this.players].sort((p1, p2) => {
      // @ts-ignore: TS7015
      return p1[key] > p2[key] ? -1 : (p1[key] < p2[key] ? 1 : 0);
    })
    if (new_order.every((val, idx) => val == this.players[idx])) {
      new_order.reverse();
    }
    this.players = new_order;
    this.store_playerslist();
  }

  drop(event: CdkDragDrop<Player[]>) {
    moveItemInArray(this.players, event.previousIndex, event.currentIndex);
    this.store_playerslist();
  }
}
