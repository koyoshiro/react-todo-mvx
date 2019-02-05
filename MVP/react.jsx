var MVP = {};

MVP.Model = function() {
    var val = 0; // 需要操作的数据

    //操作数据的方法
    this.add = function() {
        val<100 && val++;
    };
    
    this.sub = function(){
    		val>0 && val--;
    }

    this.getVal = function() {
        return val;
    };
}; 

MVP.Presenter =function(view){
		var model = new MVP.Model();
    var reactView = view;

		this.getModelVal = function(){
    	return model.getVal();
    };

    this.increase = function() {
        model.add();
        reactView.reRender();
    };

    this.decrease = function() {
        model.sub();
        reactView.reRender();
    };
}

class View extends React.Component {
  constructor(props) {
    super(props)
    
    this.presenter = new MVP.Presenter(this);
    this.state = {
    	curVal: this.presenter.getModelVal()
    }
    this.btnClick = (type)=>{
      if(type === 'add'){
        this.presenter.increase();
      }else{
        this.presenter.decrease();
      }
    }
  }
  
  reRender() {
     this.setState({'curVal':this.presenter.getModelVal()});
  }
  
  render() {
    return (
      <div>
      <p>MVP Current Value:{this.state.curVal}</p>
      <button onClick={this.btnClick.bind(this,'add')}>Click Add</button>
      <button onClick={this.btnClick.bind(this,'sub')}>Click Sub</button>
      </div>
    )
  }
}

ReactDOM.render(<View/>, document.querySelector("#app"));
