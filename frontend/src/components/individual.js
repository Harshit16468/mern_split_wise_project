import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

function Group() {
    const [people, setPeople] = useState([]);
    const [amount, setAmount] = useState('');
    const [checkedPeople, setCheckedPeople] = useState({});
    const [isFullAmountOwed, setIsFullAmountOwed] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const { id } = useParams();
    const location = useLocation();
    const emailFromLogin = location.state?.email;

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await axios.get("http://localhost:3001/members", {
                    params: {
                        id: id,
                        email: emailFromLogin
                    },
                });
                setPeople(response.data);
            } catch (error) {
                console.error("Error fetching contacts:", error);
            }
        };

        const fetchTransactions = async () => {
            try {
                const response = await axios.get("http://localhost:3001/transactions", {
                    params: {
                        id: id
                    },
                });
                setTransactions(response.data);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            }
        };

        fetchMembers();
        fetchTransactions();

        // Polling for updates every 30 seconds
        const intervalId = setInterval(fetchTransactions, 30000);

        return () => clearInterval(intervalId); // Clear the interval on component unmount
    }, [id, emailFromLogin]);

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCheckedPeople({
            ...checkedPeople,
            [name]: checked,
        });
    };

    const handleFullAmountCheckboxChange = (e) => {
        setIsFullAmountOwed(e.target.checked);
    };

    const handleAddTransaction = async () => {
        const amountFloat = parseFloat(amount);
        if (isNaN(amountFloat)) {
            alert("Please enter a valid amount.");
            return;
        }

        const selectedPeople = Object.keys(checkedPeople).filter((person) => checkedPeople[person]);
        if (selectedPeople.length === 0) {
            alert("Please select at least one person to split the amount.");
            return;
        }
        console.log()

        const transaction = {
            amount: amountFloat,
            isFullAmountOwed,
            selectedPeople,
            group: id,
            towhom: emailFromLogin,
        };

        try {
            await axios.post("http://localhost:3001/transactions", transaction);
            // Fetch updated transactions after adding new transaction
            const response = await axios.get("http://localhost:3001/transactions", {
                params: {
                    id: id
                },
            });
            setTransactions(response.data);

            // Reset form to default state
            setAmount('');
            setCheckedPeople({});
            setIsFullAmountOwed(false);

            // Close the offcanvas
            document.getElementById("offcanvasExample").classList.remove("show");
            document.querySelectorAll(".offcanvas-backdrop").forEach(el => el.remove());
        } catch (error) {
            console.error("Error adding transaction:", error);
        }
    };

    return (
        <>
            <button className="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                Add a transaction
            </button>

            <div className="offcanvas offcanvas-start" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasExampleLabel">Add a transaction</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <div className="mb-3">
                        <label htmlFor="amountInput" className="form-label">Enter amount in rupees</label>
                        <input
                            id="amountInput"
                            className="form-control"
                            type="text"
                            value={amount}
                            onChange={handleAmountChange}
                            aria-label="Enter amount in rupees"
                        />
                    </div>
                    <div className="form-check mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                            checked={isFullAmountOwed}
                            onChange={handleFullAmountCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                            You are owed the full amount
                        </label>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Split between</label>
                        {people.map((contact) => (
                            <div className="form-check" key={contact}>
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`flexCheck-${contact}`}
                                    name={contact}
                                    checked={checkedPeople[contact] || false}
                                    onChange={handleCheckboxChange}
                                />
                                <label className="form-check-label" htmlFor={`flexCheck-${contact}`}>
                                    {contact}
                                </label>
                            </div>
                        ))}
                    </div>
                    <button className="btn btn-primary" onClick={handleAddTransaction}>
                        Add Transaction
                    </button>
                </div>
            </div>

            <div className="mt-4">
                <h3>Transactions</h3>
                <ul className="list-group">
                    {transactions.map((transaction) => {
                        console.log(transaction);
                        let transactionClass = 'transaction-not-involved';
                        if (transaction.towhom === emailFromLogin) {
                            transactionClass = 'transaction-owed';
                        } else if (transaction.involved.includes(emailFromLogin)) {
                            transactionClass = 'transaction-involved';
                        }

                        return (
                            <li className={`list-group-item ${transactionClass}`} key={transaction._id}>
                                <span>Amount: {transaction.amount}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}

export default Group;
