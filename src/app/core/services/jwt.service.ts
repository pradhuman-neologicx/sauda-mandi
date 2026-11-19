import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtService {
  private http = inject(HttpClient);


  // admin panel

  getisLoggedIn(): boolean {
    return window.localStorage.getItem('isloggedIn') === 'true';
  }
  isLoggedIn(isloggedIn: boolean) {
    window.localStorage['isloggedIn'] =
      isloggedIn !== undefined ? isloggedIn : false;
  }

  getLoginAs(): number {
    return window.localStorage['LoginAs'];
  }

  saveLoginAs(LoginAs: number) {
    window.localStorage['LoginAs'] = LoginAs;
  }

  saveRoles(roles: any) {
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  getRoles() {
    return JSON.parse(localStorage.getItem('roles') || '[]');
  }

  getfirstLoggedIn(): boolean {
    return window.localStorage['isfirstlogin'];
  }
  firstLoggedIn(isfirstlogin: boolean) {
    window.localStorage['isfirstlogin'] =
      isfirstlogin !== undefined ? isfirstlogin : false;
  }

  getSession(): string {
    return window.localStorage['Session'];
  }

  saveSession(Session: string) {
    window.localStorage['Session'] = Session;
  }
  getName(): string {
    return window.localStorage['name'];
  }

  saveName(name: string) {
    window.localStorage['name'] = name;
  }

  getSessionStartdate(): string {
    return window.localStorage['Sessionstartdate'];
  }

  saveSessionStartdate(Session: string) {
    window.localStorage['Sessionstartdate'] = Session;
  }

  getSessionEnddate(): string {
    return window.localStorage['SessionEnddate'];
  }

  saveSessionEnddate(Session: string) {
    window.localStorage['SessionEnddate'] = Session;
  }

  getpanelUserId(): number {
    return window.localStorage['panel_user_id'];
  }

  savepanelUserId(userid: number) {
    window.localStorage['panel_user_id'] = userid;
  }
  getadminame(): string {
    return window.localStorage['adminname'];
  }

  saveadminame(adminname: string) {
    window.localStorage['adminname'] = adminname;
  }

  saveAdminToken(Token: string) {
    window.localStorage['Token'] = Token;
  }
  saveAdminRole(Role: string) {
    window.localStorage['Role'] = Role;
  }
  getadmiRole(): string {
    return window.localStorage['Role'];
  }
  getpanelPartyId(): number {
    return window.localStorage['Party_id'];
  }

  savePartyId(Party_id: number) {
    window.localStorage['Party_id'] = Party_id;
  }

  getType(): string {
    return window.localStorage['Type'];
  }

  saveType(Type: string) {
    window.localStorage['Type'] = Type;
  }

  getToken(): string {
    return window.localStorage['Token'];
  }

  saveToken(Token: string) {
    window.localStorage['Token'] = Token;
  }

  // Profile Image of
  getImageUrl(): string {
    return window.localStorage['ImageUrl'];
  }

  saveImageUrl(ImageUrl: string) {
    window.localStorage['ImageUrl'] = ImageUrl;
  }

  getUserId(): string {
    return window.localStorage['user_id'];
  }

  saveUserId(user_id: string) {
    window.localStorage['user_id'] = user_id;
  }

  // student panel
  getstudentLoggedIn(): boolean {
    return window.localStorage['isloggedStudent'];
  }
  isstudentLoggedIn(isloggedStudent: boolean) {
    window.localStorage['isloggedStudent'] =
      isloggedStudent !== undefined ? isloggedStudent : false;
  }

  getSessionStartdateStudent(): string {
    return window.localStorage['SessionstartdateStudent'];
  }

  saveSessionStartdateStudent(Session: string) {
    window.localStorage['SessionstartdateStudent'] = Session;
  }

  getSessionEnddateStudent(): string {
    return window.localStorage['SessionEnddateStudent'];
  }

  saveSessionEnddateStudent(Session: string) {
    window.localStorage['SessionEnddateStudent'] = Session;
  }

  getSessionStudent(): string {
    return window.localStorage['SessionStudent'];
  }

  saveSessionStudent(Session: string) {
    window.localStorage['SessionStudent'] = Session;
  }

  getpanelUserIdStudent(): string {
    return window.localStorage['panel_user_idStudent'];
  }

  savepanelUserIdStudent(userid: string) {
    window.localStorage['panel_user_idStudent'] = userid;
  }

  getTokenStudent(): string {
    return window.localStorage['TokenStudent'];
  }

  saveTokenStudent(Token: string) {
    window.localStorage['TokenStudent'] = Token;
  }

  // Profile Image of
  getImageUrlStudent(): string {
    return window.localStorage['ImageUrlStudent'];
  }

  saveImageUrlStudent(ImageUrl: string) {
    window.localStorage['ImageUrlStudent'] = ImageUrl;
  }

  getUserIdStudent(): string {
    return window.localStorage['user_idStudent'];
  }

  saveUserIdStudent(user_id: string) {
    window.localStorage['user_idStudent'] = user_id;
  }

  getLoginAsStudent(): number {
    return window.localStorage['LoginAsStudent'];
  }

  saveLoginAsStudent(LoginAs: number) {
    window.localStorage['LoginAsStudent'] = LoginAs;
  }

  ///call on logout
  clearStorage() {
    window.localStorage.removeItem('isloggedIn');
    window.localStorage.removeItem('panel_user_id');

    window.localStorage.removeItem('Token');
    window.localStorage.removeItem('Role');
    window.localStorage.removeItem('adminname');
    window.localStorage.removeItem('isfirstlogin');

    // window.localStorage.removeItem("isloggedStudent");
  }

  clearStorageStudent() {
    window.localStorage.removeItem('isloggedStudent');
    window.localStorage.removeItem('user_idStudent');
    window.localStorage.removeItem('panel_user_idStudent');
    window.localStorage.removeItem('LoginAsStudent');

    window.localStorage.removeItem('TokenStudent');
    window.localStorage.removeItem('SessionStudent');
    window.localStorage.removeItem('ImageUrlStudent');
    window.localStorage.removeItem('SessionstartdateStudent');
    window.localStorage.removeItem('SessionEnddateStudent');
  }
}
