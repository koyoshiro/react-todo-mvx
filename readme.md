# MV

## 定义
- M：模型（Model），Model层用于封装和使用业务相关的数据以及对数据的处理方法。
- V：视图（View），View层用于负责数据的展示。

## 流向
- Model <--> View：
    - 获取数据内容展示/刷新视图内容。
    - 视图的交互通过Model层改变数据。

## 示例
```
var MV = {};

MV.Model = function() {
    var val = 0; // 需要操作的数据

    //操作数据的方法
    this.add = function() {
        val<100 && val++;
    };
    
    this.sub = function(){
    	val>0&&val--;
    }

    this.getVal = function() {
        return val;
    };
}; 

class View extends React.Component {
  constructor(props) {
    super(props)
    this.model = new MV.Model();
    this.state = {
    	curVal: this.model.getVal()
    }
    this.btnClick = (type)=>{
    	if(type === 'add'){
      	this.model.add();
      }else{
      	this.model.sub();
      }
    	this.setState({'curVal':this.model.getVal()});
    }
  }
  
  render() {
    return (
      <div>
          <p>MV Current Value:{this.state.curVal}</p>
          <button onClick={this.btnClick.bind(this,'add')}>Click Add</button>
          <button onClick={this.btnClick.bind(this,'sub')}>Click Sub</button>
      </div>
    )
  }
}

ReactDOM.render(<View />, document.querySelector("#app"));
```

[在线运行](https://jsfiddle.net/koyoshiro/71am6pyb/)


# MVC

## 定义
- C：控制器（Controller）,用于控制应用程序的流程，处理用户的行为和数据上的改变。

## 流向
- View --> Controller --> Model --> View：
    - 视图的交互由View层传递给Controller层。
    - Controller层完成业务逻辑后，交由Model层改变数据。
    - Model层将新的数据发送给View层完成视图刷新。
- Controller --> Model --> View:    
    - 改变 URL 触发 hashChange 事件,由Controller接收后，交由Model层改变数据。
    - Model层将新的数据发送给View层完成视图展示/刷新/切换（类似路由）。

## 特性
- View层和Controller层之间使用了策略模式。
- Model层和View层之间使用了观察者模式，View层事先在此Model上注册，进而观察Model层，以便更新在Model上发生改变的数据。
- 业务逻辑主要集中在Controller层，当每个事件都流经Controller层时，这层会变得十分臃肿。
- View层和Controller层通常为一一对应关系，捆绑起来表示一个组件，这样过于紧密的连接造成Controller层的复用性较低。
- 执行应用时，使用Controller层为入口。

## 示例

```
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
```

[在线运行](https://jsfiddle.net/koyoshiro/dr69fgwL/)

# MVP
## 定义
- P：控制器（Presenter）,提供接口更新Model，再通过观察者模式更新View，用于隔离View层与Model层。

## 流向
- View <--> Presenter <--> Model:
    - 视图的交互由View层通过**View-Presenter接口**传递给Presenter层。
    - Presenter层完成业务逻辑后，通过**Presenter-Model接口**交由Model层改变数据。
    - Model层通过**Model-Presenter接口**将新的数据传递给Presenter层。
    - Presenter层通过**Presenter-View接口**传递给View层完成视图刷新。

## 特性
- 解耦View层和Model层，完全分离视图和模型使职责划分更加清晰；由于View不依赖Model，可以将View抽离出来做成组件，需要提供一系列接口提供给外层操作。
- Presenter层除了业务逻辑外，还有大量代码需要对从View层到Model层、从Model层到View层的数据进行“手动同步”，可维护性较差，十分厚重。
- Presenter层需应对View层的变更而变更，耦合程度较高，这是由于没有数据绑定造成的。
- 执行应用时，使用View层为入口。

## 示例
```
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
```
[在线运行](https://jsfiddle.net/koyoshiro/8sa4pLgt/)

# MVVM
## 定义
- VM：视图模型（ViewModel）,负责将View层和Model层的同步逻辑自动化。

## 流向
- View <--> ViewModel <--> Model:
    - View层通过使用模板语法来声明式完成数据渲染及事件响应。
    - ViewModel层负责处理接收到的View层事件逻辑，并同步数据至Model层。
    - ViewModel层对Model层进行更新的时，会通过数据绑定更新到View层。

## 特性
- ViewModel层的数据绑定自动化了MVP模式下的View层和Model层的数据同步逻辑。
- Model层作为数据层，仅需关注数据本身，不用关心任何行为。
- View层不再需要MVC模式下为Presenter提供接口，数据同步交给了ViewModel层 中的数据绑定进行处理，当Model层发生变化，ViewModel层就会自动更新；ViewModel层变化，Model层也会更新。
- 执行应用时，使用ViewModel层为入口。

## 示例
```
var MVVM = {};

MVVM.Model = {
    val : 0
}; 

MVVM.ViewModel =function(vmObj){
  var reactView = null,
      methods=vmObj.methods;

  this.vmData=vmObj.data;

  this.init=()=>{
    ReactDOM.render(<View renderData={this.vmData} increase={methods.add.bind(this)} decrease={methods.sub.bind(this)} register={this.register}/>, document.querySelector("#app"));
    this.observe(this.vmData);
  }

  this.register = function(ReactView) {
    if(reactView===null){
      reactView=ReactView;
    }
};
  
  this.defineReactive=(obj, key, value)=> {
    // 监听子属性
    this.observe(value);

    Object.defineProperty(obj, key, {
        get: function reactiveGetter() {
            return value;
        },
        set: function reactiveSetter(newVal) {
            if (value === newVal) {
                return;
            } else {
                console.log(`监听成功：${value} --> ${newVal}`);
                value = newVal;
                reactView.setState({'curVal':newVal});
            }
        }
    })
  }

  this.observe=(data) =>{
    if (!data || typeof data !== 'object') {
        return
    }
    var self = this;
    // 使用递归劫持对象属性
    Object.keys(data).forEach(function(key) {
        self.defineReactive(data, key, data[key]);
    })
  } 

  
}

class View extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    	curVal: this.props.renderData.val
    }
    this.btnClick = (type)=>{
      this.props.register(this);
      if(type === 'add'){
        this.props.increase();
      }else{
        this.props.decrease();
      }
    }
    
  }
 
  render() {
    return (
      <div>
          <p>MVVM Current Value:{this.state.curVal}</p>
          <button onClick={this.btnClick.bind(this,'add')}>Click Add</button>
          <button onClick={this.btnClick.bind(this,'sub')}>Click Sub</button>
      </div>
    )
  }
}

var vm= new MVVM.ViewModel({
  view:View,
  data:MVVM.Model,
  methods:{
      add: function() {
        this.vmData.val<100 && this.vmData.val++;
    },
      sub: function(){
        this.vmData.val>0 && this.vmData.val--;
    }
  }
});
vm.init();
```
[在线运行](https://jsfiddle.net/koyoshiro/61ce0tpv/)