import PropTypes from "prop-types";

interface AppProps {
	name: string;
}

function App(props: AppProps) {
	return <h1>Hello, {props.name}!</h1>;
}

App.propTypes = {
	name: PropTypes.string,
};

export default App;
