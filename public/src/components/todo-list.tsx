import app, { Component, on } from 'apprun';

const ENTER = 13


const keyup = e => {
  const input = e.target;
  if (e.keyCode === ENTER && input.value) {
    add();
    input.value = '';
  }
};

const add = () => {
  app.run('//:', '@create-todo', {
    title: (document.getElementById('new_todo') as HTMLInputElement).value,
    done: 0
  })
};

const toggle = (_, todo) => { app.run('//:', '@update-todo', { ...todo, done: !todo.done }) };

const remove = (_, todo) => { app.run('//:', '@delete-todo', todo) };

const clear = () => { app.run('//:', '@delete-all-todo') };

const search = (state, filter) => ({ ...state, filter });

const Todo = ({todo}) => <li>
  <input type="checkbox" checked={todo.done} $onclick={[toggle, todo]}></input>&nbsp;
  <span style={{color: todo.done ? 'green' : 'red'}}>
    {todo.title} <a href='#' $onclick={[remove, todo]}>&#9249;</a></span>
  {/* <span>({todo.ip})</span> */}
</li>;

export default class TodoComponent extends Component{
  state = {
    filter: 0,
    todos: []
  }

  view = (state) => {
    const styles = (filter) => ({
      'font-weight': state.filter === filter ? 'bold' : 'normal',
      cursor: 'pointer'
    })
    return <div>
      <h1>Todo <span class="spinner-grow spinner-grow-sm mb-4 d-none" id="spinner"></span></h1>
      <div>
        <span>Show:</span>
        <span> <a style={styles(0)} $onclick={[search, 0]}>All</a></span> |
        <span> <a style={styles(1)} $onclick={[search, 1]}>Todo</a></span> |
        <span> <a style={styles(2)} $onclick={[search, 2]}>Done</a></span>
      </div>
      <ul>
        {
          state.todos
            .filter(todo => state.filter === 0 ||
              (state.filter === 1 && !todo.done) ||
              (state.filter === 2 && todo.done) )
            .map((todo) => <Todo todo={todo} />)
        }
      </ul>
      <div>
        <input placeholder='add todo' onkeyup={keyup} id="new_todo"/>{' '}
        <button class="btn btn-sm btn-primary" $onclick={[add]}>Add</button>{' '}
        <button class="btn btn-sm btn-secondary" $onclick={[clear]}>Clear</button>
      </div>
    </div>
  }

  // update = {
  //   '@show-all': (state, todos) => ({ ...state, todos }),
  //   '@saving': () => {
  //     document.getElementById('spinner').classList.remove('d-none');
  //   }
  // }

  @on('@show-todos')
  show_todos = (state, todos) => ({ ...state, todos });
}


