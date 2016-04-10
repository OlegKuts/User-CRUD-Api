var UserBox = React.createClass({

	getInitialState: function() {
	    return {users: [], editUser:'', showEditForm:false};
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
		var newUsers = users.filter(function(element){
			return element.id !== userId;
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

	handleUserEditClick:function(user){
		this.setState({editUser:user, showEditForm:true});
	},

	handleUserCancelClick:function(){
		this.setState({showEditForm:false});
	},

	handleUserEdit:function(user){
		var { users } = this.state;
		var userId = user.id;
		var newUsers = users.map(function(element){
			if(element.id === userId){
				return user;
			}
			return element;
		});
		this.setState({users: newUsers});
		console.log(user);
		$.ajax({
	      url: "http://localhost:3000/api/users/"+userId,
	      cache: false,
	      type:'PATCH',
	      data: user,
	      success: function(data) {
	        this.setState({users: newUsers});
	      }.bind(this),
	      error: function(xhr, status, err) {
	      	this.setState({users: users});
	        console.error(this.props.url, status, err.toString());
	      }.bind(this)
	    });
	},

	componentDidMount: function() {
	    this.getUsers();
	},

	render:function(){
		var users = this.state.users;
		var edit = this.state.showEditForm ? <EditUserForm user = {this.state.editUser} userEdit={this.handleUserEdit}
					cancelEdit={this.handleUserCancelClick}/>:'';
		return 	<div>
					<UserForm onUserSubmit={this.handleUserSubmit}/>
					<div className="col-md-8">
						<UserTable users = {users} userDelete={this.handleUserDelete} userEdit={this.handleUserEditClick}/>
					</div>
					<div className="col-md-4">
						{edit}
					</div>
				</div>;
	}
});

var UserTable = React.createClass({

	render: function(){
		var userDelete = this.props.userDelete;
		var userEdit = this.props.userEdit;
		var users = this.props.users.map(function(user){
			return <User user={user} key={user.id} userDelete={userDelete} userEdit={userEdit}/>
		});
		return <table className="table"><tbody>{users}</tbody></table>;
	}
})

var User = React.createClass({

	handleDelete: function(){
		this.props.userDelete(this.props.user);
	},

	handleEdit: function(){
		this.props.userEdit(this.props.user);
	},

	render:function(){
		var { name, surname, country, age } = this.props.user;
		return 	<tr>
					<td>{name}</td>
					<td>{surname}</td>
					<td>{country}</td>
					<td>{age}</td>
					<td><button onClick={this.handleDelete}>Delete</button></td>
					<td><button onClick ={this.handleEdit}>Edit</button></td>
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

var EditUserForm = React.createClass({
	getInitialState: function() {
		var { id, name, surname, country, age } = this.props.user;
	    return {id: id,name: name, surname: surname, country: country, age: age};
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
		var { id, name, surname, country, age } = this.state;
		if( !(name || surname || country || age) ){
			return;
		}
		this.props.userEdit({id: id, name: name, surname: surname, country: country, age: age});
		this.props.cancelEdit();		
	},

	handleCancel:function(event){
		event.preventDefault();
		this.props.cancelEdit();
		
	},

	componentWillReceiveProps:function(nextProps){
		var { id, name, surname, country, age } = nextProps.user;
		this.setState({id: id, name: name, surname: surname, country: country, age: age});
	},

	render: function(){
			var { name, surname, country, age } = this.state;

		return (
				<form className="">
			        <input onChange={this.handleNameIput}
			          type="text"
			          value= {name}/>
			        <input onChange={this.handleSurnameIput}
			          type="text"
			          value= {surname}/>
			        <input onChange={this.handleCountryIput}
			          type="text"
			          value= {country}/> 
			         <input onChange={this.handleAgeIput}
			          type="number"
			          value= {age}/> 
			        <input onClick={this.handleSubmit} type="submit" value="Submit" />
			        <input onClick={this.handleCancel} type="submit" value="Cancel" />
		      	</form>
			);
	}
});