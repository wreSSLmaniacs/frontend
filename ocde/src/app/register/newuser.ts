export class NewUser{
	username='';
	email='';
	password='';
	image = '';
	first_name = '';
	last_name = '';

	constructor(
		username:string,
		email:string,
		password:string,
		image:string,
		first_name:string,
		last_name:string
	)
	{	
		this.image=image;
		this.username=username;
		this.email=email;
		this.password=password;
		this.first_name=first_name;
		this.last_name=last_name;
	}
		
}