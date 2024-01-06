import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ABI } from '../utils/abi'; 

const Client = ({ signer }) => {
    const [works, setWorks] = useState([]);
    const [freelancerAddress, setFreelancerAddress] = useState('');
    const [amount, setAmount] = useState(''); 
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const initializeContract = async () => {
            try {
                let provider;
                if (window.ethereum == null) {
                    console.log("MetaMask not installed; using read-only defaults");
                    provider = ethers.getDefaultProvider();
                } else {
                    provider = new ethers.BrowserProvider(window.ethereum);
                }

                const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
    
                const contractInstance = new ethers.Contract(contractAddress, ABI, signer || provider);
                setContract(contractInstance);
            } catch (error) {
                console.error("Error initializing contract:", error);
            }
        };
    
        initializeContract();
    }, [signer]);
    
    useEffect(() => {
        // Update the table only when contract is not null
        if (contract) {
            updateTable();
        }
    }, [contract]);

    const updateTable = async () => {
        try {
            // Fetch and display works from the contract
            const index = await contract.workIndex()
            console.log(index)
            const signerAddress = await signer.getAddress();

            const worksArray = [];
            for (let i = 1; i <= index; i++) {
                const work = await contract.works(i);

                // Display only works where the client address matches the signer address
                if (work.client.toLowerCase() === signerAddress.toLowerCase()) {
                    worksArray.push({
                        index: i,
                        freelancer: work.freelancer,
                        completed: work.completed,
                    });
                }
            }
            setWorks(worksArray);
        } catch (error) {
            console.error("Error updating table:", error);
        }
    };

    const addWork = async () => {
        try {
            const transaction = await contract.depositFunds(freelancerAddress, {
                value: ethers.parseEther(amount),
            });

            await transaction.wait();
            console.log("Funds deposited successfully!");
            setAmount('')
            setFreelancerAddress('')
            await updateTable();
        } catch (error) {
            console.error("Error depositing funds:", error);
        }
    };

    const finishWork = async (index) => {
        try {
            // Trigger the smart contract function to mark work as completed
            const transaction = await contract.completeWork(index);
            await transaction.wait();

            // Update the UI after successful completion
            updateTable();
        } catch (error) {
            console.error(`Error completing work ${index}:`, error);
        }
    };

    return (
        <div>
            <h1 className="head">Quality Talent, Seamless Projects: Your Ideal Freelance Hub!</h1>
            <form action="submit" className="form">
                <label htmlFor="freelancer-address">Freelancer Address:</label>
                <input 
                    type="text" 
                    placeholder="Enter freelancer address" 
                    className="freelancer" 
                    id="freelancer-address" 
                    value={freelancerAddress} 
                    onChange={(e) => setFreelancerAddress(e.target.value)}
                />
                <label htmlFor="amount">Enter the Amount</label>
                <input 
                    type="number" 
                    placeholder="Amount (in ETH)" 
                    className="amount" 
                    id="amount" 
                    step="0.001" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                />
            </form>
            <button className="button" onClick={addWork}>Add Work</button>
            <div>
                <h2>Your Works</h2>
                <div className="work">
                    <table>
                        <thead>
                            <tr>
                                <th>Freelancer Address</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {works.map((work) => (
                                <tr key={work.index}>
                                    <td>{work.freelancer}</td>
                                    <td>{work.completed ? 'Completed' : 'Pending'}</td>
                                    <td>
                                        {work.completed ? (
                                            'Completed'
                                        ) : (
                                            <button
                                                className="finish-button"
                                                onClick={() => finishWork(work.index)}
                                            >
                                                Finish
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Client;
