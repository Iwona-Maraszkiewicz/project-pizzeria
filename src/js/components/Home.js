import {templates} from '../settings.js';


class Home{
  constructor(element){
    const thisHome = this;
    thisHome.render(element);

  }
  render(element){
    const thisHome = this;
    const generatedHTML = templates.home();
    thisHome.dom = {};
    thisHome.dom.wrapper = element;
    thisHome.dom.wrapper.innerHTML = generatedHTML;

  }
  initWidgets(){

  }
}
export default Home;
