export class NewUser{
	username='';
	email='';
	password='';
	image='';
	constructor(
		username:string,
		email:string,
		password:string,
		image:string
	)
	{
		this.username=username;
		this.email=email;
		this.password=password;
		this.image=image;
	}
		
}