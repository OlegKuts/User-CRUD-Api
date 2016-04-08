var Layout = React.createClass({
	render:function(){
		return 	<div className="container">
					<div className="row"><UserBox/></div>
				</div>;
	}
});

var UserBox = React.createClass({

	getInitialState: function() {
	    return {users: []};
	},

	componentDidMount: function() {
	    $.ajax({
	      url: "http://localhost:3000/api/users",
	      //dataType: 'json',
	      cache: false,
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
		return <UserTable users = {users}/>;
	}
});

var UserTable = React.createClass({

	render: function(){
		var users = this.props.users.map(function(user){
			return <User user={user} key={user.id}/>
		});
		return <table className="table-bordered"><tbody>{users}</tbody></table>;
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