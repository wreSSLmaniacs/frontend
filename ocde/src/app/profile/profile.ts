/**Description
 * A profile interface to store the details of the user which will be used to send the API request.
 */
export interface Profile{
    user_fk: any;
    username:string;
    password:string;
    email: string;
    image:string;
}