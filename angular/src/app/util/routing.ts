import { Route, Routes } from "@angular/router"
import { GenericChecklistComponent } from "../tools/generic-checklist/generic-checklist.component"

export enum Tags {
  IdleOn = "idleon",
  CounterStrike = "counterstrike",
  Checklist = "checklist",
  Tool = "tool"
}

function autoTagChecklist(route: Route) : Route {
  if(route.component === GenericChecklistComponent) {
    route.data!["tags"].push(Tags.Checklist)
  }
  return route
}

function autoTagRoute(route: Route) : Route {
  if(!route.data) {
    route.data = {
      tags: []
    }
  } else if(!route.data?.['tags']) {
    route.data!['tags'] = []
  }
  return autoTagChecklist(route)
}

export function postProcessRoutes(routes: Routes) : Routes {
  return routes.map(autoTagRoute)
}
