import { Component, signal } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataEncoderService } from '../../services/data-encoder.service';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { hashCode } from '../../util/hash';

export interface Task {
  name: string;
  completed: boolean;
  skip: boolean;
  id: number,
  subtasks?: Task[];
}

type updateBool = boolean | "unchanged"

@Component({
  selector: 'app-generic-checklist',
  standalone: true,
  imports: [
    MatCheckboxModule,
    FormsModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule
  ],
  templateUrl: './generic-checklist.component.html',
  styleUrls: ['./generic-checklist.component.scss'],
})
export class GenericChecklistComponent {
  public checklistData: any;
  public autoSave: boolean = true;
  public hideSkipped: boolean = false;
  private id_counter = 1;
  private list_name : undefined | string;
  public list_title : undefined | string

  readonly task = signal<Task>({
    name: "Checklist",
    completed: false,
    skip: false,
    id: 0
  });

  constructor(dataEncoder: DataEncoderService, activatedRoute: ActivatedRoute) {
    activatedRoute.data.subscribe(data => {
      let content = data["content"]
      if (content !== undefined) {
        dataEncoder.decode(content).subscribe(decoded => {
          this.list_name = hashCode(decoded)
          let json = JSON.parse(decoded);
          this.list_title = json["title"]
          this.task.set({
            name: "Checklist",
            completed: false,
            skip: false,
            subtasks: this.mapToSubtasks(json["content"]),
            id: 0
          })
          this.load()
        })
      } else {
        activatedRoute.paramMap.subscribe(params => {
          let content = params.get("content")
          if(content !== null) {
            dataEncoder.decode(content).subscribe(decoded => {
              this.list_name = hashCode(decoded)
              let json = JSON.parse(decoded);
              this.list_title = json["title"]
              this.task.set({
                name: "Checklist",
                completed: false,
                skip: false,
                subtasks: this.mapToSubtasks(json["content"]),
                id: 0
              })
              this.load()
            })
          }
        })
      }
    })
  }

  arrayToSubtasks (jsonArray: any) : Task[] {
    return jsonArray.flatMap((item: any) => {
      if(typeof item === "string") {
        // Single subtask
        return {
          name: item,
          completed: false,
          skip: false,
          id: this.id_counter++
        }
      } else {
        // Map of Subtasks
        return this.mapToSubtasks(item);
      }
    })
  }

  mapToSubtasks(jsonMap: any) : Task[] {
    return Object.keys(jsonMap).map((key: any) => {
      return {
        name: key,
        completed: false,
        skip: false,
        hidden: false,
        subtasks: this.arrayToSubtasks(jsonMap[key]),
        id: this.id_counter++
      }
    })
  }

  partiallyComplete(t: Task) : boolean {
    if (!t.subtasks) {
      return false;
    }
    return t.subtasks.some(t => t.completed || this.partiallyComplete(t)) && !t.subtasks.every(t => t.completed);
  };

  updateAllSubtasksWithValue(subtasks: Task[] | undefined, completed: updateBool, disabled: updateBool) {
    return subtasks?.map((t) : Task => {
      let new_completed = t.completed;
      if(completed !== "unchanged") {
        new_completed = completed;
      }

      let new_skip = t.skip;
      if(disabled !== "unchanged") {
        new_skip = disabled;
      }

      if(new_skip) {
        new_completed = true;
      }

      return {
        ...t,
        completed: new_completed,
        skip: new_skip,
        subtasks: t.subtasks ? this.updateAllSubtasksWithValue(t.subtasks, completed, disabled) : undefined
      }
    }
  );
}

updateSubtasks(outer_task: Task, completed: updateBool, disabled: updateBool, changed_subtask: Task) {
  if (outer_task === changed_subtask) {
    if(completed !== "unchanged") {
      outer_task.completed = completed;
    }
    if(disabled !== "unchanged") {
      outer_task.skip = disabled;
    }

    outer_task.subtasks = this.updateAllSubtasksWithValue(outer_task.subtasks, completed, disabled);
  } else {
    outer_task.subtasks?.map(t => {
      this.updateSubtasks(t, completed, disabled, changed_subtask);
    })
    outer_task.completed = outer_task.subtasks?.every(t => t.completed) ?? outer_task.completed;
  }
  return {...outer_task};
}

update(completed: boolean, subtask: Task) {
  this.task.update(task => {
    return this.updateSubtasks(task, completed, 'unchanged', subtask);
  });

  if(this.autoSave) {
    this.save()
  }
}

updateSkipBox(completed: boolean, subtask: Task) {
  this.task.update(task => {
    return this.updateSubtasks(task, completed, completed, subtask);
  });

  if(this.autoSave) {
    this.save()
  }
}

reset() {
  this.task.update(task => {
    return {
      ...task,
      completed: false,
      skip: false,
      subtasks: this.updateAllSubtasksWithValue(task.subtasks, false, false)
    }
  });

  if(this.autoSave) {
    this.save()
  }
}

collect_ids_recursive(task: Task): { checked_ids: number[], skipped_ids: number[] } {
  let checked_ids = []
  let skipped_ids = []
  if(task.completed) {
    checked_ids.push(task.id)
  }
  if(task.skip) {
    skipped_ids.push(task.id)
  }
  task.subtasks?.forEach(
    subtask => {
      let subtask_ids = this.collect_ids_recursive(subtask)
      if(subtask_ids.checked_ids.length > 0) {
        checked_ids.push(...subtask_ids.checked_ids)
      }
      if(subtask_ids.skipped_ids.length > 0) {
        skipped_ids.push(...subtask_ids.skipped_ids)
      }
    }
  )
  return { checked_ids, skipped_ids }
}

save() {
  this.task.update((task)=> {
    let ids = this.collect_ids_recursive(task)
    if(this.list_name !== undefined) {
      localStorage.setItem(this.list_name + ".checked", ids.checked_ids.join(","))
      localStorage.setItem(this.list_name + ".skipped", ids.skipped_ids.join(","))
      localStorage.setItem(this.list_name + ".autosave", this.autoSave.toString())
      localStorage.setItem(this.list_name + ".hideskipped", this.hideSkipped.toString())
    } else {
      console.log("Could not generate a list name, cannot save!")
    }
    console.log("saved")
    return task;
  })
}

mark_ids_recursive(task: Task, checked_ids: number[], skipped_ids: number[]) : Task {
  return {
    ...task,
    completed: checked_ids.includes(task.id),
    skip: skipped_ids.includes(task.id),
    subtasks: task.subtasks?.map(st => this.mark_ids_recursive(st, checked_ids, skipped_ids))
  };
}

load() {
  if(this.list_name !== undefined) {
    let checked = localStorage.getItem(this.list_name + ".checked")?.split(",")?.map(parseInt) ?? []
    let skipped = localStorage.getItem(this.list_name + ".skipped")?.split(",")?.map(parseInt) ?? []

    this.task.update((task)=> {
      return { ...this.mark_ids_recursive(task, checked, skipped) };
    })

    let autoSave = localStorage.getItem(this.list_name + ".autosave")
    if(autoSave !== null) {
      this.autoSave = autoSave === "true" ? true : false;
    }

    let hideSkipped = localStorage.getItem(this.list_name + ".hideskipped")
    if(hideSkipped !== null) {
      this.hideSkipped = hideSkipped === "true" ? true : false;
    }
  } else {
    console.log("Could not load checklist state as a list name could not be generated!")
  }
}
}
