export class Token {
    constructor(
        public id: string | null,
        private _token: string,
        private _expiresIn: number ,
        private _authority: string
    ){
        
    }

    get token(){
        if(!this._expiresIn || this._expiresIn < new Date().getTime()) {
            return null;
        }
        return this._token;
    }

    get authority(){
        return this._authority;
    }

    get expiresIn() {
        return this._expiresIn;
    }

    get userId() {
        return this.id;
    }
}