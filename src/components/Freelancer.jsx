import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ABI } from '../utils/abi';

const Freelancer = ({ signer }) => {
    const [works, setWorks] = useState([]);
    const [contract, setContract] = useState(null)

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
            const index = await contract.workIndex();
            console.log(index)
            const signerAddress = await signer.getAddress();

            const worksArray = [];
            for (let i = 1; i <= index; i++) {
                const work = await contract.works(i);

                if (work.freelancer.toLowerCase() === signerAddress.toLowerCase()) {
                    worksArray.push({
                        index: i,
                        client: work.client,
                        completed: work.completed,
                        amount: work.amount
                    });
                }
            }
            setWorks(worksArray);
        } catch (error) {
            console.error("Error updating table:", error);
        }
    };

    const handleWithdrawButtonClick = async (index) => {
        await withdrawFunds(index);
    };

    const withdrawFunds = async (index) => {
        try {
            const transaction = await contract.withdrawFunds(index);

            await transaction.wait();
            console.log(`Funds for work ${index} withdrawn successfully!`);
            await updateTable();
        } catch (error) {
            console.error(`Error withdrawing funds for work ${index}:`, error);
        }
    };

    return (
        <div>
            <h1 className="head">Quality Talent, Seamless Projects: Your Ideal Freelance Hub!</h1>
            <div className="works">
                <h2>Your Works</h2>
                <div className="work">
                    <table>
                        <thead>
                            <tr>
                                <th>Client Address</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {works.map((work) => (
                                <tr key={work.index}>
                                    <td>{work.client}</td>
                                    <td>{work.completed ? 'Completed' : 'Pending'}</td>
                                    <td>
                                        {work.completed && work.amount > 0 ? (
                                            <button
                                                className="withdraw-button"
                                                onClick={() => handleWithdrawButtonClick(work.index)}
                                            >
                                                Withdraw Funds
                                            </button>
                                        ) : ''}
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

export default Freelancer;
