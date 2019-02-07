var MVVM = {};

MVVM.Model = {
    val : 0
}; 

MVVM.ViewModel =function(vmObj){
  var reactView = null,
      methods=vmObj.methods;

  this.vmData=vmObj.data;

  this.init=()=>{
    ReactDOM.render(
      <View renderData={MVVM.Model} 
            increase={methods.add} 
            decrease={methods.sub} 
            register={this.register}/>, 
      document.querySelector("#app"));
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
  }
  
  componentDidMount(){
  	this.props.register(this);
  }
 
  render() {
    return (
      <div>
      <p>MVVM Current Value:{this.state.curVal}</p>
      <button onClick={this.props.increase.bind(this)}>Click Add</button>
      <button onClick={this.props.decrease.bind(this)}>Click Sub</button>
      </div>
    )
  }
}

var vm= new MVVM.ViewModel({
  view:View,
  data:MVVM.Model,
  methods:{
      add: function() {
        MVVM.Model.val<100 && MVVM.Model.val++;
    },
      sub: function(){
        MVVM.Model.val>0 && MVVM.Model.val--;
    }
  }
});
vm.init();

