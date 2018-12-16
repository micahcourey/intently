import {throwError as observableThrowError,  Observable ,  Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Headers, Response, RequestOptions } from '@angular/http';
import { map, catchError } from 'rxjs/operators';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {
  private loggedIn = false;
  public user = null;
	private databaseUrl = environment.firebase.databaseURL;
	private loginStatusChange: Subject<any>;

	constructor(
		private http: HttpClient,    
		public db: AngularFirestore,
		public afAuth: AngularFireAuth
	) { 
    // this.loggedIn = !!localStorage.getItem('matrix_auth_token');
    // this.user = JSON.parse(localStorage.getItem('matrix_user'));
		// this.loginStatusChange = new Subject<any>();
		// if (this.user) {
		// 	console.log(this.user)
		// 	this.loginStatusChange.next({logged_in: true});
		// } else {
		// 	console.log('not logged in', this.user)
		// 	this.loginStatusChange.next({logged_in: false});
		// 	console.log(this.loginStatusChange)
    // }
  }

	getLoginStatusChangeSub(){
		console.log(this.loginStatusChange)
		return this.loginStatusChange;
	}

	doUpdate(){
    // this.user = JSON.parse(localStorage.getItem('matrix_user'));
	}

	getOptions() {
    return { headers: new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('matrix_auth_token')) };
  }

  extractData(res: Response) {  
		return res || {};
	}

	handleError (error: any) {
		console.error(error);
		let errMsg = (error.message) ? error.message :
			error.status ? `${error.status} - ${error.statusText}` : 'Server error';
		console.error(errMsg); // log to console instead

		if(error.status == 401){
			localStorage.removeItem('matrix_auth_token');
			localStorage.removeItem('matrix_user');
			this.loginStatusChange.next({logged_in: false});
			throw new Error("Token Expired");
		}
		if(error.status == 400){ //form validation error
			return observableThrowError(error.json());
		}
		return observableThrowError(errMsg);
	}


  getCurrentUser(){
    return new Promise<any>((resolve, reject) => {
      let user = firebase.auth().onAuthStateChanged(function(user){
        if (user) {
					console.log('auth user', user)
          resolve(user);
        } else {
          reject('No user logged in');
        }
      })
    })
  }

  updateCurrentUser(value){
    return new Promise<any>((resolve, reject) => {
      let user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: value.name,
				photoURL: user.photoURL
      }).then(res => {
        resolve(res)
      }, err => reject(err))
    })
  }

	getUsers() {
		return new Promise((resolve, reject) => {
			const token = localStorage.getItem('matrix_auth_token');
			const sub = this.http.get(`${this.databaseUrl}/MatrixUsers/?access_token=${token}`)
				.pipe(map(this.extractData)).pipe(catchError(this.handleError));
			sub.subscribe((res) => { 
				console.log(res)
				resolve(res);
			}, (rej) => {
				console.log(rej)
			}); 
		});
	}

	getTasks(userId) {
		return new Promise<any>((resolve, reject) => {
			this.db.collection('/tasks', ref => ref.where('userId', '==', userId))
			.snapshotChanges().subscribe(snapshots => {
				let tasks = []
				snapshots.forEach(item => {
					let task: any = item.payload.doc.data()
					task.id = item.payload.doc.id
					tasks.push(task)
				})
				console.log('userservice', tasks)
				resolve(tasks)
			})
		})
	}

	getGoals(userId) {
		return new Promise<any>((resolve, reject) => {
			this.db.collection('/goals', ref => ref.where('userId', '==', userId)).snapshotChanges().subscribe(snapshots => {
				let goals = [];
				snapshots.forEach(item => {
					let goal: any = item.payload.doc.data()
					goal.id = item.payload.doc.id
					goals.push(goal)
				})
				console.log(goals)
				resolve(goals)
			})
		})
	}

	postTask(task) {
		console.log(task)
		return this.db.collection('tasks').add(task)
	}

	patchTask(task, taskId) {
		console.log(taskId, task)
		return this.db.collection('tasks').doc(taskId).update(task)
	}

	postGoal(goal) {
		return this.db.collection('goals').add(goal)
	}

	patchGoal(goal) {
		console.log(goal)
		return this.db.collection('goals').doc(goal.id).update(goal)
	}

	deleteGoal(goalId) {
		return this.db.collection('goals').doc(goalId).delete()
	}



	// testUniqueResetParams(uniqueParams) {
	// 	return new Promise((resolve, reject) => {
	// 		const headers: any = new HttpHeaders();
	// 		headers.append('Content-Type', 'application/json');

	// 		const uniqueSub = this.http.post( this.databaseUrl + '/test-unique', uniqueParams, this.getOptions()).pipe(map(this.extractData));

	// 		uniqueSub.subscribe((res: any) => {
	// 			resolve(res.data.username);
	// 		}, (res) => {
	// 			reject(res.error.message.errors);
	// 		});
	// 	});
	// }

	// resetPassword(resetValues){
	// 	return new Promise( (resolve, reject) => {
	// 		let headers: any = new HttpHeaders();
	// 		headers.append('Content-Type', 'application/json');

	// 		let loginSub = this.http.post( this.databaseUrl + '/reset-password', resetValues, this.getOptions()).pipe(map(this.extractData));

	// 		loginSub.subscribe((res: any) => {
	// 			resolve(res);
	// 		}, (res) => {
	// 			reject(res);
	// 		});
	// 	});
	// }

	// requestPasswordToken(resetValues){
	// 	return new Promise( (resolve, reject) => {
	// 		let headers: any = new HttpHeaders();
	// 		headers.append('Content-Type', 'application/json');

	// 		let loginSub = this.http.post( this.databaseUrl + '/request-password-token', resetValues, this.getOptions()).pipe(map(this.extractData));

	// 		loginSub.subscribe((res: any) => {
	// 			resolve(res);
	// 		}, (res) => {
	// 			reject(res);
	// 		});
	// 	});
	// }

	// submitResetPassword(resetValues){
	// 	return new Promise( (resolve, reject) => {
	// 		let headers: any = new HttpHeaders();
	// 		headers.append('Content-Type', 'application/json');

	// 		let loginSub = this.http.post( this.databaseUrl + '/submit-reset-password', resetValues, this.getOptions()).pipe(map(this.extractData));

	// 		loginSub.subscribe((res: any) => {
	// 			resolve(res);
	// 		}, (res) => {
	// 			reject(res.error.message.errors);
	// 			console.error(res);
	// 		});
	// 	});
	// }




	// getUser() {
	// 	return this.user;
	// }

	// getUsername() {
	// 	if(this.user) {
	// 		return this.user.name;
	// 	} else {
	// 		return null;
	// 	}
	// }

	// getUserEmail() {
	// 	if(this.user) {
	// 		return this.user.email;
	// 	} else {
	// 		return null;
	// 	}
	// }

	// isSuper() {
	// 	if(!this.loggedIn || !this.user)
	// 		return false;

	// 	if(this.user.member_level_id == 1)
	// 		return true;
	// 	return false;
	// }

	// isAdmin() {
	// 	if(!this.loggedIn || !this.user)
	// 		return false;

	// 	if(this.user.member_level_id <= 2)
	// 		return true;
	// 	return false;
	// }
	
	// isTech() {
	// 	if(!this.loggedIn || !this.user)
	// 		return false;

	// 	if(this.user.member_level_id <= 3)
	// 		return true;
	// 	return false;
	// } 

	// isStaff() {
	// 	if(!this.loggedIn || !this.user)
	// 		return false;

	// 	if(this.user.member_level_id <= 4)
	// 		return true;
	// 	return false;
	// } 

}
