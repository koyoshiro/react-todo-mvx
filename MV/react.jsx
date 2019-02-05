var MV = {};

MV.Model = function() {
    var val = 0; // 需要操作的数据

    //操作数据的方法
    this.add = function() {
        val++;
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

ReactDOM.render(<View />, document.querySelector("#app"))
