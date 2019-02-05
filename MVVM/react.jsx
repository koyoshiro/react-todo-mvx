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

