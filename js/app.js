var config = {
  apiKey: "AIzaSyC3I2TylXNwATQFDfZ7J4LfZzh2VUZoAe8",
  authDomain: "chatty-a53c9.firebaseapp.com",
  databaseURL: "https://chatty-a53c9.firebaseio.com",
};
firebase.initializeApp(config);

var converter = new Showdown.converter();

let Comment = () => {
  var rawMarkup = converter.makeHtml(this.props.children.toString());
  return (
    <div className='comment'>
      <h2 className='commentAuthor'>{this.props.author}</h2>
      <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
    </div>
  );
};


let CommentList = ({ data }) => {
  
  var commentNodes = data.map( (comment, index) => {
    return <Comment key={index} author={comment.author}>{comment.text}</Comment>;
  });

  return <div className='commentList'>{commentNodes}</div>;
}

let AddTodo = ({ dispatch }) => {
  let input;

  return (
    <div>
      <input ref={node => {
        input = node;
      }} />
      <button onClick={() => {
        dispatch(addTodo(input.value));
        input.value = '';
      }}>
        Add Todo
      </button>
    </div>
  );
};

let handleSubmit = ({
  event,
  author,
  text) => {
    event.preventDefault();
    var author = author.value.trim();
    var text = text.value.trim();
    debugger
    onCommentSubmit({author: author, text: text});
    author.value = '';
    text.value = '';
  }

let CommentForm = ({ onCommentSubmit }) => {
  let author
  let text

  return (
    <form className='commentForm' onSubmit={() => {
      handleSubmit(this.event, author, text)
      }
    }>
      <input type='text' placeholder='Your name' ref={node => {
        author = node;
      }} />
      <input type='text' placeholder='Say something...' ref={node => {
        text = node;
      }} />
      <input type='submit' value='Post' />
    </form>
  );
};


class CommentBox extends React.Component {
  mixins () {
    return [ReactFireMixin]
  }

  handleCommentSubmit (comment) {
    // Here we push the update out to Firebase and let ReactFire update this.state.data
    this.firebaseRefs['data'].push(comment);
  }

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentWillMount () { () => {
    // Here we bind the component to Firebase and it handles all data updates,
    // no need to poll as in the React example.
      this.bindAsArray(firebase.database().ref('commentsBox'), 'data');
    }
  }

  render () {
    return (
      <div className='commentBox'>
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
};

ReactDOM.render(
  <CommentBox />,
  document.getElementById('content')
);
