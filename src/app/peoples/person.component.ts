import { Component, OnInit } from '@angular/core';
import { PersonModel } from './_models/person.model';
import { Observable, Subject,throwError, of , BehaviorSubject} from 'rxjs';
import { PeoplesService } from './_services/peoples.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PeoplesComponent implements OnInit {

  peoples$: BehaviorSubject<PersonModel[]>;

  constructor(
    private peoplesService: PeoplesService
  ) { }

  ngOnInit() {
    this.peoples$  = this.peoplesService.peoples$;
  }

  hasItems(items: PersonModel[]): boolean {
    return items && items.length > 0 ? true : false;
  }

}
