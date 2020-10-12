import { app, Component } from 'apprun';
import Todo from './todo-list';

export default class HomeComponent extends Component {
  state = 'Hello word - AppRun';
  view = (state) => <div>
    <Todo />
  </div>;

}