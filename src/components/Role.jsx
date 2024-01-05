import React, { useState } from 'react'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom';

const Role = ({ setSigner }) => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('');

    const handleSignIn = async () => {
        let signer = null;
        let provider;

        if (window.ethereum == null) {
            console.log('MetaMask not installed; using read-only defaults');
            provider = ethers.getDefaultProvider();
        } else {
            provider = new ethers.BrowserProvider(window.ethereum);
            signer = await provider.getSigner();
            setSigner(signer);
        }

        // Perform any additional logic based on the selected role
        if (selectedRole === 'freelancer') {
            navigate('/freelancer');
        } else if (selectedRole === 'client') {
            navigate('/client');
        }
    };
    return (
        <div>
            <select id="roleSelect" required onChange={(e) => setSelectedRole(e.target.value)}>
                <option value="">Select Role</option>
                <option value="freelancer">Freelancer</option>
                <option value="client">Client</option>
            </select>
            <button onClick={handleSignIn}>Sign In</button>
        </div>
    )
}

export default Role
