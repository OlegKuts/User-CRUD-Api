var UserBox = React.createClass({

	getInitialState: function() {
	    return {users: []};
	},

	handleUserSubmit:function (user) {
		var { users } = this.state;
		user.id = Date.now();
		var newUsers = users.concat([user]);
		this.setState({users: newUsers});
		 $.ajax({
	      url: "http://localhost:3000/api/users",
	      cache: false,
	      type:'POST',
	      data: user,
	      success: function(data) {
	      	let newUsers = users.concat([data]);
	        this.setState({users: newUsers});
	      }.bind(this),
	      error: function(xhr, status, err) {
	      	this.setState({users: users});
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	},

	handleUserDelete: function(user){
		var { users } = this.state;
		var userId = user.id;
		var newUsers = users.filter(function(el){
			return el.id !== userId;
		});
		this.setState({users: newUsers});
		$.ajax({
	      url: "http://localhost:3000/api/users/"+userId,
	      cache: false,
	      type:'DELETE',
	      data: userId,
	      success: function(data) {
	        this.setState({users: newUsers});
	      }.bind(this),
	      error: function(xhr, status, err) {
	      	this.setState({users: users});
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	},

	getUsers: function(){
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

	componentDidMount: function() {
	    this.getUsers();
	},

	render:function(){
		var users = this.state.users;
		return 	<div>
					<UserForm onUserSubmit={this.handleUserSubmit}/>
					<div className="col-md-10">
						<UserTable users = {users} userDelete={this.handleUserDelete}/>
					</div>
				</div>;
	}
});

var UserTable = React.createClass({

	render: function(){
		var userDelete = this.props.userDelete
		var users = this.props.users.map(function(user){
			return <User user={user} key={user.id} userDelete={userDelete}/>
		});
		return <table className="table"><tbody>{users}</tbody></table>;
	}
})

var User = React.createClass({

	handleDelete: function(){
		this.props.userDelete(this.props.user);
	},

	render:function(){
		var { name, surname, country, age } = this.props.user;
		return 	<tr>
					<td>{name}</td>
					<td>{surname}</td>
					<td>{country}</td>
					<td>{age}</td>
					<td><button onClick={this.handleDelete}>Delete</button></td>
				</tr>;
	}	
})

var UserForm = React.createClass({
	getInitialState: function() {
	    return {name: '', surname: '', country: '', age: ''};
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
		this.setState({name: '', surname: '', country: '', age: ''});
		$('input').val('');
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