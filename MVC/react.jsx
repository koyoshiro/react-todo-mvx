var MVC = {};

MVC.Model = function() {
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
    
    //观察者模式
    var reactView = null;

    this.register = function(ReactView) {
    		if(reactView===null){
        	reactView=ReactView;
        }
    };

    this.notify = function() {
        reactView.setState({'curVal':this.getVal()});
    };
}; 

MVC.Controller =function(){
		var model = null;

    this.init = function() {
        /* 初始化Model和View */
        model = new MVC.Model();
				ReactDOM.render(<View controller={this}/>, document.querySelector("#app"));
    };
    
    this.getModelVal = function(){
    	 return model.getVal();
    };

		this.registerView = function(ReactView){
    		model.register(ReactView);
    };
    
    /* 让Model更新数值并通知View更新视图 */
    this.increase = function() {
        model.add();
        model.notify();
    };

    this.decrease = function() {
        model.sub();
        model.notify();
    };
}

class View extends React.Component {
  constructor(props) {
    super(props)
    const {controller} = props;
    this.state = {
    	curVal: controller.getModelVal()
    }
    this.btnClick = (type)=>{
    	controller.registerView(this);
      if(type === 'add'){
        controller.increase();
      }else{
        controller.decrease();
      }
    }
  }
  
  render() {
    return (
      <div>
      <p>MVC Current Value:{this.state.curVal}</p>
      <button onClick={this.btnClick.bind(this,'add')}>Click Add</button>
      <button onClick={this.btnClick.bind(this,'sub')}>Click Sub</button>
      </div>
    )
  }
}

var controllerInstance = new MVC.Controller();
controllerInstance.init(View);



