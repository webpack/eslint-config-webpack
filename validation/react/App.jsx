import PropTypes from "prop-types";

/**
 * @param {{ name: string }} props props
 * @returns {JSX.Element} Application
 * @constructor
 */
function App(props) {
	return <h1>Hello, {props.name}!</h1>;
}

App.propTypes = {
	name: PropTypes.string,
};

export default App;
