const InputValidation = ({ value, onChange, type, rules, id, name}) => {
	return (
		<>
			<input type={type} value={value} onChange={onChange} id={id} name={name} className="form-control" />
			{rules && value.length > 0 ? (
				<ul className="alert alert-primary">
					{rules.map((rule) => {
						return (
							<li>
								{rule.fn(value) ? "🟢" : "🔴"} {rule.text}
							</li>
						);
					})}
				</ul>
			) : (
				""
			)}
		</>
	);
};

export default InputValidation;
