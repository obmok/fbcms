import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

class ApiService {
  fb = firebase

  signIn = (email, password) =>
    this.fb.auth().signInWithEmailAndPassword(email, password)
  
  logOut = () =>
    this.fb.auth().signOut()
  
  signUp = (email, password) =>
    this.fb.auth().createUserWithEmailAndPassword(email, password)

  loadAllPeople = () =>
    this.fb
      .database()
      .ref('people')
      .once('value')
      .then((res) => res.val())

  deletePerson = (id) =>
    this.fb
      .database()
      .ref(`people/${id}`)
      .remove()

  addPerson = (person) =>
    this.fb
      .database()
      .ref('people')
      .push(person)

  onAuthStateChanged = (callback) => this.fb.auth().onAuthStateChanged(callback)

  peopleSubscription = (callback) => {
    const dataCallback = (snapshot) => callback(snapshot.val())

    this.fb
      .database()
      .ref('people')
      .on('value', dataCallback)

    return () =>
      this.fb
        .database()
        .ref('people')
        .off('value', dataCallback)
  }
}

export default new ApiService()