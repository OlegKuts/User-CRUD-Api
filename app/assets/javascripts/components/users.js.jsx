var tableStyle = {
	padding:'20px',
	WebkitTransition: 'all', // note the capital 'W' here
	msTransition: 'all' // 'ms' is the only lowercase vendor prefix
};


var UserBox = React.createClass({

	getInitialState: function() {
	    return {users: []};
	},

	handleUserSubmit:function (user) {
		var { users } = this.state;
		user.id = Date.now();
		var updatedUsers = users.concat([user]);
		this.setState({users: updatedUsers});
		 $.ajax({
	      url: "http://localhost:3000/api/users",
	      cache: false,
	      type:'POST',
	      data: user,
	      success: function(data) {
	        this.setState({users: updatedUsers});
	      }.bind(this),
	      error: function(xhr, status, err) {
	      	this.setState({users: users});
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	},

	componentDidMount: function() {
	    $.ajax({
	      url: "http://localhost:3000/api/users",
	      cache: false,
	      type:'GET',
	      success: function(data) {
	        this.setState({users: data});
	      }.bind(this),
	      error: function(xhr, status, err) {
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	},

	render:function(){
		var users = this.state.users;
		return 	<div>
					<UserForm onUserSubmit={this.handleUserSubmit}/>
					<div className="col-md-10">
						<UserTable users = {users}/>
					</div>
				</div>;
	}
});

var UserTable = React.createClass({

	render: function(){
		var users = this.props.users.map(function(user){
			return <User user={user} key={user.id}/>
		});
		return <table className="table"><tbody>{users}</tbody></table>;
	}
})

var User = React.createClass({
	render:function(){
		var { name, surname, country, age } = this.props.user;
		return 	<tr>
					<td>{name}</td>
					<td>{surname}</td>
					<td>{country}</td>
					<td>{age}</td>
				</tr>;
	}	
})

var UserForm = React.createClass({
	getInitialState: function() {
	    return {name: '', surname: '', country: '', age: 0};
	},

	handleNameIput:function(event){
		this.setState({name: event.target.value});
	},
	handleSurnameIput:function(event){
		this.setState({surname: event.target.value});
	},
	handleCountryIput:function(event){
		this.setState({country: event.target.value});
	},
	handleAgeIput:function(event){
		this.setState({age: event.target.value});
	},
	handleSubmit:function(event){
		event.preventDefault();
		var { name, surname, country, age } = this.state;
		if( !(name || surname || country || age) ){
			return;
		}
		this.props.onUserSubmit({name: name, surname: surname, country: country, age: age});
		this.setState({name: '', surname: '', country: '', age: 0});
	},
	render:function(){
		return 	<form className="">
			        <input onChange={this.handleNameIput}
			          type="text"
			          placeholder="Name"/>
			        <input onChange={this.handleSurnameIput}
			          type="text"
			          placeholder="Surname"/>
			        <input onChange={this.handleCountryIput}
			          type="text"
			          placeholder="Country"/> 
			         <input onChange={this.handleAgeIput}
			          type="number"
			          placeholder="Age"/> 
			        <input onClick={this.handleSubmit} type="submit" value="Add new user" />
		      	</form>
	}
});

var Header = React.createClass({
	render:function(){
		return 	<div className="page-header">
					<h1>Header</h1>
				</div>
	}
});