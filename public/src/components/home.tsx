import { app, Component } from 'apprun';

export default class HomeComponent extends Component {
  state = 'Hello word - AppRun';
  view = (state) => <div>
    <h1>{state}</h1>
  </div>;

}