import PropTypes from "prop-types";

/**
 * @param {{ name: string }} props props
 * @returns {JSX.Element} Application
 * @constructor
 */
function App(props) {
	return <h1>Hello, {props.name}!</h1>;
}

const GroupPropType = PropTypes.shape({
	id: PropTypes.string.isRequired,
	size: PropTypes.number,
});

App.propTypes = {
	name: PropTypes.string,
	groups: PropTypes.arrayOf((...args) => GroupPropType(...args)),
};

export default App;
