import { Component, OnInit, ViewChild } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/user';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';
import { GroupService } from 'src/app/_services/group.service';
import { Group } from 'src/app/_models/group';
import { Assignment } from 'src/app/_models/assignment';
import { AssignmentService } from 'src/app/_services/assignment.service';

@Component({
  selector: 'app-admin-landing',
  templateUrl: './admin-landing.component.html',
  styleUrls: ['./admin-landing.component.css']
})
export class AdminLandingComponent implements OnInit {
  @ViewChild('adminTabs') adminTabs: TabsetComponent;
  user: User;
  users: User[];
  groups: Group[];
  assignments: Assignment[];
  userParams: any = {};
  pagination:  Pagination;

  constructor(
    private userService: UserService,
    private assignmentService: AssignmentService,
    private groupService: GroupService,
    private alertify: AlertifyService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe( data => {
      this.user = data['user'];
      this.pagination = data['users'].pagination;
    });

    this.route.queryParams.subscribe(params => {
      const selectTab = params['tab'];
      this.adminTabs.tabs[selectTab > 0 ? selectTab : 0].active = true;
    });
  }

  groupLoads() {
    this.loadUngroupedUsers();
    this.loadUserGroups();
  }

  loadUngroupedUsers() {
    this.userParams.getUngrouped = true;
    this.userService.getUngroupedUsers(this.userParams)
      .subscribe((res:  User[]) => {
      this.users = res;
    }, error => {
      this.alertify.error(error);
    });
  }

  loadUserGroups() {
    console.log('loadGroups');
    this.groupService.getGroups(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe((res:  PaginatedResult<Group[]>) => {
        this.groups = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }

  loadAssignments() {
    console.dir('loaded assignments');
    this.assignmentService.getAssignments(this.pagination.currentPage, this.pagination.itemsPerPage)
      .subscribe((res:  PaginatedResult<Assignment[]>) => {
        this.assignments = res.result;
        this.pagination = res.pagination;
      }, error => {
        this.alertify.error(error);
      });
  }

  loadEvents() {
    console.dir('loadEvents');
  }

}
