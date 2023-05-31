import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  { path: 'blockchain', loadChildren: () => import('./blockchain/blockchain.module').then(m => m.BlockchainModule) },
  {
    path:'',
    redirectTo:'blockchain',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
