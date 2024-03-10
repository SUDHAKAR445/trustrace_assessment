import { Observable } from "rxjs/internal/Observable";

export interface IDeactivateComponent {
    canExit: () => boolean | Observable<boolean> | Promise<boolean>;
}