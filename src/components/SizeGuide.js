import React, { useState } from 'react';
import './SizeGuide.css';

const SizeGuide = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('baby');

    if (!isOpen) return null;

    const sizeData = {
        baby: {
            title: 'Baby Sizes (0-24 Months)',
            sizes: [
                { size: 'Newborn', age: '0-1 months', weight: '2.5-4.5 kg', height: '48-56 cm', chest: '38-41 cm' },
                { size: '0-3M', age: '0-3 months', weight: '4-6 kg', height: '56-62 cm', chest: '41-44 cm' },
                { size: '3-6M', age: '3-6 months', weight: '6-8 kg', height: '62-68 cm', chest: '44-47 cm' },
                { size: '6-9M', age: '6-9 months', weight: '8-9 kg', height: '68-74 cm', chest: '47-49 cm' },
                { size: '9-12M', age: '9-12 months', weight: '9-11 kg', height: '74-80 cm', chest: '49-51 cm' },
                { size: '12-18M', age: '12-18 months', weight: '11-12 kg', height: '80-86 cm', chest: '51-53 cm' },
                { size: '18-24M', age: '18-24 months', weight: '12-14 kg', height: '86-92 cm', chest: '53-55 cm' }
            ]
        },
        toddler: {
            title: 'Toddler Sizes (2-6 Years)',
            sizes: [
                { size: '2-3 years', age: '2-3 years', weight: '12-14 kg', height: '86-92 cm', chest: '53-55 cm' },
                { size: '3-4 years', age: '3-4 years', weight: '14-16 kg', height: '92-98 cm', chest: '55-57 cm' },
                { size: '4-5 years', age: '4-5 years', weight: '16-18 kg', height: '98-104 cm', chest: '57-59 cm' },
                { size: '5-6 years', age: '5-6 years', weight: '18-21 kg', height: '104-110 cm', chest: '59-61 cm' }
            ]
        },
        duvet: {
            title: 'Duvet Sizes',
            sizes: [
                { size: 'Cot Duvet', dimensions: '80x120 cm', fits: 'Cot/crib' },
                { size: 'Toddler Duvet', dimensions: '120x150 cm', fits: 'Toddler bed' },
                { size: 'Single Duvet', dimensions: '135x200 cm', fits: 'Single bed' },
                { size: 'Double Duvet', dimensions: '200x200 cm', fits: 'Double bed' }
            ]
        },
        shoes: {
            title: 'Baby & Toddler Shoes',
            sizes: [
                { size: '0 (Newborn)', age: '0-3 months', footLength: '8-9 cm', euSize: '15-16' },
                { size: '1', age: '3-6 months', footLength: '9-10 cm', euSize: '17' },
                { size: '2', age: '6-12 months', footLength: '10-11 cm', euSize: '18' },
                { size: '3', age: '12-18 months', footLength: '11-12 cm', euSize: '19' },
                { size: '4', age: '18-24 months', footLength: '12-13 cm', euSize: '20-21' },
                { size: '5', age: '2 years', footLength: '13-14 cm', euSize: '22' },
                { size: '6', age: '2-3 years', footLength: '14-15 cm', euSize: '23-24' },
                { size: '7', age: '3-4 years', footLength: '15-16 cm', euSize: '25' },
                { size: '8', age: '4-5 years', footLength: '16-17 cm', euSize: '26-27' }
            ]
        }
    };

    const currentData = sizeData[activeTab];

    return (
        <div className="size-guide-overlay" onClick={onClose}>
            <div className="size-guide-modal" onClick={(e) => e.stopPropagation()}>
                <div className="size-guide-header">
                    <h2>Size Guide</h2>
                    <button className="size-guide-close" onClick={onClose} aria-label="Close size guide">
                        ✕
                    </button>
                </div>

                <div className="size-guide-tabs">
                    <button 
                        className={`size-tab ${activeTab === 'baby' ? 'active' : ''}`}
                        onClick={() => setActiveTab('baby')}
                    >
                         Baby
                    </button>
                    <button 
                        className={`size-tab ${activeTab === 'toddler' ? 'active' : ''}`}
                        onClick={() => setActiveTab('toddler')}
                    >
                         Toddler
                    </button>
                    <button 
                        className={`size-tab ${activeTab === 'duvet' ? 'active' : ''}`}
                        onClick={() => setActiveTab('duvet')}
                    >
                         Duvet
                    </button>
                    <button 
                        className={`size-tab ${activeTab === 'shoes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('shoes')}
                    >
                         Shoes
                    </button>
                </div>

                <div className="size-guide-content">
                    <h3>{currentData.title}</h3>
                    
                    <div className="size-table-wrapper">
                        <table className="size-table">
                            <thead>
                                <tr>
                                    <th>Size</th>
                                    {activeTab === 'duvet' ? (
                                        <>
                                            <th>Dimensions</th>
                                            <th>Fits</th>
                                        </>
                                    ) : activeTab === 'shoes' ? (
                                        <>
                                            <th>Age</th>
                                            <th>Foot Length</th>
                                            <th>EU Size</th>
                                        </>
                                    ) : (
                                        <>
                                            <th>Age</th>
                                            <th>Weight</th>
                                            <th>Height</th>
                                            <th>Chest</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {currentData.sizes.map((item, index) => (
                                    <tr key={index}>
                                        <td><strong>{item.size}</strong></td>
                                        {activeTab === 'duvet' ? (
                                            <>
                                                <td>{item.dimensions}</td>
                                                <td>{item.fits}</td>
                                            </>
                                        ) : activeTab === 'shoes' ? (
                                            <>
                                                <td>{item.age}</td>
                                                <td>{item.footLength}</td>
                                                <td>{item.euSize}</td>
                                            </>
                                        ) : (
                                            <>
                                                <td>{item.age}</td>
                                                <td>{item.weight}</td>
                                                <td>{item.height}</td>
                                                <td>{item.chest}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="size-guide-tips">
                        <h4>📏 Measuring Tips:</h4>
                        <ul>
                            <li><strong>Weight:</strong> Weigh your baby without clothes</li>
                            <li><strong>Height:</strong> Measure from head to toe while lying flat</li>
                            <li><strong>Chest:</strong> Measure around the fullest part of the chest</li>
                            {activeTab === 'shoes' && (
                                <li><strong>Foot Length:</strong> Measure from heel to longest toe while standing</li>
                            )}
                            <li><strong>Between sizes?</strong> We recommend sizing up for growing babies</li>
                        </ul>
                    </div>

                    <div className="size-guide-note">
                        <p>💡 <strong>Note:</strong> Sizes may vary slightly by style. Check individual product details for specific measurements.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SizeGuide;
