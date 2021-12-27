import React from 'react'
import { Form, ProgressBar } from 'react-bootstrap'

export const PasswordComponent = ({onPasswordChange, password, strongPassword}) => (
    <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
            type="password"
            placeholder="Password"
            onChange={onPasswordChange}
            value={password}
            isInvalid={!strongPassword.valid}
        />
        <Form.Text>Make sure it's at least 15 characters OR at least 8 characters including a number and a lowercase letter</Form.Text>
        <ProgressBar now={strongPassword.strong} label={strongPassword.name} variant={strongPassword.variant}/>
    </Form.Group>
)

export default PasswordComponent