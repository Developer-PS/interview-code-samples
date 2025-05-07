import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Params, Route, Router, RouterLink, UrlTree } from '@angular/router';
import { Tags } from '../../util/routing';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import MiniSearch, { SearchResult } from "minisearch";
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { switchMap } from 'rxjs/operators';


type SearchListItem = Route & {
  id: number,
  description: string
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  public all_items: SearchListItem[];
  public items: SearchListItem[];
  public tags: string[];
  public tags_formControl: FormControl
  public search_formControl: FormControl
  public autoCompleteSuggestions: string[] = []
  private selected_tags: string[] = []
  private searchEngine = new MiniSearch({
    fields: ["title", "description"],
    searchOptions: {
      boost: { title: 2 },
      fuzzy: 0.6
    }
  })
  private searchField = ""
  private searchTimeout: NodeJS.Timeout | undefined
  private maxResultCount = 20
  private searchRefreshTimeout = 200 // ms
  
  constructor(
    private router: Router, 
    activeRoute: ActivatedRoute
  ) {
    this.tags_formControl = new FormControl('');
    this.search_formControl = new FormControl('');
    this.all_items = router.config.filter(it => (it.data?.["hidden"]) === undefined).map((element, index) => {
      return {
        id: index,
        description: element.data?.["description"],
        ...element
      }
    });
    this.items = [...this.all_items].slice(0, this.maxResultCount);
    this.tags = Object.values(Tags)
    this.tags_formControl.valueChanges.subscribe(new_selected_tags => {
      this.selected_tags = new_selected_tags
      this.filter_items()
      this.updateNavigator()
    })
    this.search_formControl.valueChanges.subscribe(new_searchField => {
      this.searchField = new_searchField
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.filter_items()
        this.updateAutoComplete()
        this.updateNavigator()
      }, this.searchRefreshTimeout)
    })
    this.searchEngine.addAll(this.all_items)

    let params = activeRoute.snapshot.queryParams
    
    if(params["query"]) {
      let query = params["query"]!
      this.searchField = query
      this.search_formControl.setValue(query)
    }
    if(params["tags"]) {
      let tags = params["tags"]!.split(",")
      this.selected_tags = tags
      this.tags_formControl.setValue(tags)
    }

    console.log("params: ", params)
    console.log(this.searchField, this.selected_tags)
  
  }

  private filterAndSort(items: SearchListItem[], scores: SearchResult[]): SearchListItem[] {
    const scoreMap = new Map<number, number>(scores.map(s => [s.id, s.score]));

    const filteredItems = items
        .filter(item => scoreMap.has(item.id))
        .map(item => ({ ...item, score: scoreMap.get(item.id)! }));

    filteredItems.sort((a, b) => b.score - a.score);

    return filteredItems;
}

  private filter_items() {
    let filtered_items = [...this.all_items];
    if(this.searchField !== "") {
      let searchResults : SearchResult[] = this.searchEngine.search(this.searchField)
      filtered_items = this.filterAndSort(filtered_items, searchResults).slice(0, this.maxResultCount)
    }
    filtered_items = filtered_items.filter(item => {
      return this.selected_tags.every(tag => item.data?.["tags"].includes(tag))
    })
    this.items = filtered_items
  }

  private updateAutoComplete() {
    let suggestions = this.searchEngine.autoSuggest(this.searchField)
    this.autoCompleteSuggestions = suggestions.map(it => it.suggestion)
  }

  private updateNavigator() {
    let queryParams : Params = { 
      tags: this.selected_tags.length > 0 ? this.selected_tags.join(",") : null,
      query: this.searchField.length > 0 ? this.searchField : null
    };

    this.router.navigate(
      [], 
      {
        onSameUrlNavigation: "ignore",
        replaceUrl: true,
        queryParams, 
        queryParamsHandling: 'merge', // remove to replace all query params by provided
      }
    );
  }
}
