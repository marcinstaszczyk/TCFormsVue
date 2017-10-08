export default class MessagesService {
    
  _counter = 0;
  messages = []; //new Array<{no: number, message: string, status: string}>();

  _FADEOUT_ANIMATION_TIME = 1000;

  constructor() { }

  showError(message, visibleMiliseconds = 5000) {
    const no = ++this._counter;

    this.messages.push({no: no, message: message, status: 'show'});

    setTimeout(() => 
      this.messages = this.messages.map(
        (item) => { return item.no !== no ? item : {no: item.no, message: item.message, status: 'fadeout'} }
      )
    , visibleMiliseconds);

    setTimeout(() => 
      this.messages = this.messages.filter(item => item.no !== no)
    , visibleMiliseconds + this._FADEOUT_ANIMATION_TIME);
  }
}
    