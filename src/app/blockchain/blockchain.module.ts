import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlockchainRoutingModule } from './blockchain-routing.module';
import { BlockchainComponent } from './blockchain.component';


@NgModule({
  declarations: [
    BlockchainComponent,

  ],
  imports: [
    CommonModule,
    BlockchainRoutingModule
  ]
})
export class BlockchainModule { }
