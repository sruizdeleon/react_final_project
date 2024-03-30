import { useEffect, useState } from "react";

const TextAreaValidation = ({ value, onChange, type, rules, id, name, className, onHandleFieldValidated }) => {
	const [isFocused, setIsFocused] = useState(false);
	const [isBlur, setIsBlur] = useState(false);

	useEffect(()=>{
		let validations = rules?.map((rule)=> rule.fn(value) ? true : false)
		const validationFinished = !validations.includes(false)
		validationFinished ? onHandleFieldValidated(name, true) : onHandleFieldValidated(name, false);
	}, [value])

	const handleFocus = () => {
		setIsFocused(true);
		setIsBlur(false);
	};

	const handleBlur = () => {
		setIsFocused(false);
		setIsBlur(true);
	};

	return (
		<>
			<textarea
				type={type}
				value={value}
				onChange={onChange}
				id={id}
				name={name}
				className={className}
				onFocus={handleFocus}
				onBlur={handleBlur}
			/>
			{rules && value.length > 0 && isFocused ? (
				<ul className="signup__validation-container">
					{rules.map((rule, i) => {
						return (
							<li className="signup__validation" key={i}>
								{rule.fn(value) ? "🟢" : "🔴"} {rule.text}
							</li>
						);
					})}
				</ul>
			) : rules && isBlur && value.length > 0 ? (
				<ul className="signup__validation-container">
					{rules.map((rule, i) => {
						return (
							<li className="signup__validation" key={i}>
								{rule.fn(value) === false ? "🔴" + rule.text : false}
							</li>
						);
					})}
				</ul>
			) : (
				false
			)}
		</>
	);
};

export default TextAreaValidation;
