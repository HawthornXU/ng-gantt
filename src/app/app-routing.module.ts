import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'gantt', pathMatch: 'full' },
  { path: 'gantt', loadChildren: () => import('./gantt-demo/gantt-demo.module').then(m => m.GanttDemoModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
