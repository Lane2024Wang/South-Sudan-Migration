
const rectangles = document.querySelectorAll('.rectangle');


async function loadHtmlContent() {
    const response = await fetch('1.html'); 
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    return doc.body;
}


async function loadHtmlContent() {
    const response = await fetch('2.html');
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    return doc.body; 
}


async function loadHtmlContent() {
    const response = await fetch('2.html');
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    return doc.body; 
}


async function loadHtmlContent() {
    const response = await fetch('2.html'); 
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    return doc.body; 
}



async function loadFlowData() {
    const response = await fetch('dataFlow.csv');
    const text = await response.text();
    const rows = text.split('\n');
    const data = rows.slice(1)
        .map(row => row.split(','))
        .filter(row => row.length >= 7);


    const flowData = data.map(row => ({
        population: parseFloat(row[2].trim()),       
        male: parseInt(row[3].trim()),            
        malePercentage: parseFloat(row[4].trim()),  
        female: parseInt(row[5].trim()),            
        femalePercentage: parseFloat(row[6].trim())  
    }));
    return flowData;
}

 
async function loadLmtData() {
    const response = await fetch('dataLmt.csv');
    const text = await response.text();
    const rows = text.split('\n');
    const data = rows.slice(1)
        .map(row => row.split(','))
        .filter(row => row.length >= 8);

 
    const lmtData = data.map(row => ({
        lyPercent: parseFloat(row[2].trim()),
        lnPercent: parseFloat(row[4].trim()),
        ryPercent: parseFloat(row[6].trim()),
        rnPercent: parseFloat(row[8].trim())
    }));
    return lmtData;
}

 
async function initializeRectangles() {
    const flowData = await loadFlowData();
    const lmtData = await loadLmtData();
    const htmlContent = await loadHtmlContent(); 


 
    let isRectangleClicked = false;

    rectangles.forEach((rect, index) => {
        rect.addEventListener('click', () => {
 
            const alreadyClicked = rect.classList.contains('active');
    
 
            rectangles.forEach(r => {
                r.classList.remove('active');
                r.classList.remove('hide-month');
            });
    
            if (!alreadyClicked) {
 
                rect.classList.add('active');
    
 
                rectangles.forEach((r, idx) => {
                    if (idx !== index) {
                        r.classList.add('hide-month');
                    }
                });
    
 
                isRectangleClicked = true;
            } else {
 
                isRectangleClicked = false;
            }
        });
    });
    

    rectangles.forEach((rect, index) => {
        const flow = flowData[index] || {};
        const lmt = lmtData[index] || {};
 
        const contentId = `chart${index + 1}`; 
        const malePercentage = flow.malePercentage / 100; 
        const femalePercentage = flow.femalePercentage / 100;


        if (flow.population != null) {
            const percentage = flow.population / 25000;
            const rectHeight = rect.offsetHeight;
            const pixelHeight = rectHeight * percentage;
            rect.style.setProperty('--dot-bottom', `${pixelHeight}px`);
        }

        rect.addEventListener('click', (e) => {
            e.stopPropagation();
            const clickedId = e.target.closest('.rectangle').dataset.id;
            

            rectangles.forEach((r, idx) => {
                if (r.dataset.id === clickedId) {
                    const dotBottom = parseFloat(getComputedStyle(r).getPropertyValue('--dot-bottom'));
                    const malePercentage = flow.malePercentage / 100;
                    const blueHeight = (dotBottom + 5) * malePercentage;
                    const redHeight = dotBottom + 5 - blueHeight;

                    r.classList.add('dynamic-content');
                    r.style.width = '440px'; 
                    r.innerHTML = '';

 
                    const blueRect = document.createElement('div');
                    blueRect.style.position = 'absolute';
                    blueRect.style.bottom = '0';
                    blueRect.style.left = '0';
                    blueRect.style.width = '220px';
                    blueRect.style.height = `${blueHeight}px`;
                    blueRect.style.backgroundColor = 'lightgrey';

 
                    const blueText = document.createElement('div');
                    blueText.innerHTML = `Men<br>${flow.male} (${flow.malePercentage.toFixed(2)}%)`;
                    blueText.style.position = 'absolute';
                    blueText.style.top = '50%';
                    blueText.style.left = '50%';
                    blueText.style.transform = 'translate(-50%, -50%)';
                    blueText.style.color = 'white'; 
                    blueText.style.fontSize = '14px';
                    blueText.style.fontWeight = 'bold';
                    blueText.style.textAlign = 'center';
                    blueRect.appendChild(blueText);

 
                    const redRect = document.createElement('div');
                    redRect.style.position = 'absolute';
                    redRect.style.bottom = `${blueHeight}px`;
                    redRect.style.left = '0';
                    redRect.style.width = '220px';
                    redRect.style.height = `${redHeight}px`;
                    redRect.style.backgroundColor = 'grey';

 
                    const redText = document.createElement('div');
                    redText.innerHTML = `Women<br>${flow.female} (${flow.femalePercentage.toFixed(2)}%)`;
                    redText.style.position = 'absolute';
                    redText.style.top = '50%';
                    redText.style.left = '50%';
                    redText.style.transform = 'translate(-50%, -50%)'; 
                    redText.style.color = 'white'; 
                    redText.style.fontSize = '14px';
                    redText.style.fontWeight = 'bold';
                    redText.style.textAlign = 'center';
                    redRect.appendChild(redText);

 
                    r.appendChild(blueRect);
                    r.appendChild(redRect);



 
                    const mainContainer = document.createElement('div');
                    mainContainer.style.position = 'absolute';
                    mainContainer.style.right = '10px';
                    mainContainer.style.top = '53%';
                    mainContainer.style.transform = 'translateY(-50%)';
                    mainContainer.style.display = 'flex';
                    mainContainer.style.flexDirection = 'column';
                    mainContainer.style.gap = '20px';

 
                    const circle = document.createElement('div');
                    circle.style.width = '200px'; 
                    circle.style.height = '250px'; 
                    circle.style.backgroundColor = 'none';
                    circle.style.margin = '0 auto'; 
                    circle.style.marginBottom = '-10px'; 
                    circle.classList.add('circle');
                    
                    mainContainer.appendChild(circle);

 
                    const topContainer = document.createElement('div');
                    topContainer.style.display = 'flex';
                    topContainer.style.flexDirection = 'column';
                    topContainer.style.gap = '2px';

                    const topTitle = document.createElement('div');
                    topTitle.textContent = 'Longterm Migration or Not?';
                    topTitle.style.fontWeight = 'bold';
                    topTitle.style.textAlign = 'center';
                    topContainer.appendChild(topTitle);
                    topTitle.style.fontSize = '13px';

                    const topRow = document.createElement('div');
                    topRow.style.display = 'flex';
                    topRow.style.position = 'relative';
                    topRow.style.gap = '0px';

                    const topShapes = [
                        { width: `${(lmt.lyPercent / 100) * 200}px`, height: '20px', color: '#C1272D', text: `${lmt.lyPercent}%  Yes` },
                        { width: `${(lmt.lnPercent / 100) * 200}px`, height: '20px', color: 'lightgrey', text: `${lmt.lnPercent}%  No` }
                    ];

                    topShapes.forEach(shape => {
                        const rectangle = document.createElement('div');
                        rectangle.style.width = shape.width;
                        rectangle.style.height = shape.height;
                        rectangle.style.backgroundColor = shape.color;
                        rectangle.style.position = 'relative';

                        const text = document.createElement('div');
                        text.textContent = shape.text;
                        text.style.position = 'absolute';
                        text.style.bottom = '-13px';
                        text.style.textAlign = 'center';
                        text.style.width = shape.width;
                        text.style.fontSize = '12px';
                        text.style.overflow = 'visible';
                        text.style.whiteSpace = 'nowrap';

                        rectangle.appendChild(text);

 
                        if (shape.color === '#C1272D') {
                            rectangle.addEventListener('mouseenter', () => {
                                const circle = document.querySelector('.circle');

                                if (!circle) {
                                    console.error('Circle element not found.');
                                    return;
                                }

 
                                circle.innerHTML = '';

 
                                const iframe = document.createElement('iframe');
                                iframe.src = `1.html#${contentId}`; 
                                iframe.style.width = '220px';
                                iframe.style.height = '220px';
                                iframe.style.border = 'none';
                                iframe.style.overflow = 'hidden';
                                iframe.scrolling = 'no';

 
                                circle.appendChild(iframe);

 
                                circle.style.display = 'flex'; 
                                circle.style.justifyContent = 'center'; 
                                circle.style.alignItems = 'center'; 
                            });

                            rectangle.addEventListener('mouseleave', () => {
 
                                rectangle.classList.add('waiting-clear');
                            });
                        }

 
                        if (shape.color === 'lightgrey') {
                            rectangle.addEventListener('mouseenter', () => {
                                const circle = document.querySelector('.circle');

                                if (!circle) {
                                    console.error('Circle element not found.');
                                    return;
                                }

 
                                circle.innerHTML = '';

 
                                const iframe = document.createElement('iframe');
                                iframe.src = `2.html#${contentId}`; 
                                iframe.style.width = '220px'; 
                                iframe.style.height = '220px';
                                iframe.style.border = 'none'; 
                                iframe.style.overflow = 'hidden';
                                iframe.scrolling = 'no';

 
                                circle.appendChild(iframe);

 
                                circle.style.display = 'flex'; 
                                circle.style.justifyContent = 'center'; 
                                circle.style.alignItems = 'center';
                            });

                            

                            rectangle.addEventListener('mouseleave', () => {
 
                                rectangle.classList.add('waiting-clear');
                            });
                        }

                        topRow.appendChild(rectangle);
                    });

                    topContainer.appendChild(topRow);

 
                    const bottomContainer = document.createElement('div');
                    bottomContainer.style.display = 'flex';
                    bottomContainer.style.flexDirection = 'column';
                    bottomContainer.style.gap = '2px';

                    const bottomTitle = document.createElement('div');
                    bottomTitle.textContent = 'Registered Refugee or Not?';
                    bottomTitle.style.fontWeight = 'bold';
                    bottomTitle.style.textAlign = 'center';
                    bottomContainer.appendChild(bottomTitle);
                    bottomTitle.style.fontSize = '13px';

                    const bottomRow = document.createElement('div');
                    bottomRow.style.display = 'flex';
                    bottomRow.style.gap = '0px';

                    const bottomShapes = [
                        { width: `${(lmt.ryPercent / 100) * 200}px`, height: '20px', color: '#C1272D', text: `${lmt.ryPercent}% Yes` },
                        { width: `${(lmt.rnPercent / 100) * 200}px`, height: '20px', color: 'lightgrey', text: `${lmt.rnPercent}%  No` }
                    ];

                    bottomShapes.forEach(shape => {
                        const rectangle = document.createElement('div');
                        rectangle.style.width = shape.width;
                        rectangle.style.height = shape.height;
                        rectangle.style.backgroundColor = shape.color;
                        rectangle.style.position = 'relative';

                        const text = document.createElement('div');
                        text.textContent = shape.text;
                        text.style.position = 'absolute';
                        text.style.bottom = '-13px';
                        text.style.textAlign = 'center';
                        text.style.width = shape.width;
                        text.style.fontSize = '12px';
                        text.style.overflow = 'visible';
                        text.style.whiteSpace = 'nowrap';

                        rectangle.appendChild(text);

 
                        if (shape.color === '#C1272D') {
                            rectangle.addEventListener('mouseenter', () => {
                                const circle = document.querySelector('.circle');

                                if (!circle) {
                                    console.error('Circle element not found.');
                                    return;
                                }

 
                                circle.innerHTML = '';

 
                                const iframe = document.createElement('iframe');
                                iframe.src = `3.html#${contentId}`; 
                                iframe.style.width = '220px'; 
                                iframe.style.height = '220px'; 
                                iframe.style.border = 'none'; 
                                iframe.style.overflow = 'hidden';
                                iframe.scrolling = 'no';

 
                                circle.appendChild(iframe);

 
                                circle.style.display = 'flex'; 
                                circle.style.justifyContent = 'center'; 
                                circle.style.alignItems = 'center'; 
                            });

                            rectangle.addEventListener('mouseleave', () => {
 
                                rectangle.classList.add('waiting-clear');
                            });
                        }

 
                        if (shape.color === 'lightgrey') {
                            rectangle.addEventListener('mouseenter', () => {
                                const circle = document.querySelector('.circle');

                                if (!circle) {
                                    console.error('Circle element not found.');
                                    return;
                                }

 
                                circle.innerHTML = '';

 
                                const iframe = document.createElement('iframe');
                                iframe.src = `4.html#${contentId}`;
                                iframe.style.width = '220px'; 
                                iframe.style.height = '220px'; 
                                iframe.style.border = 'none'; 
                                iframe.style.overflow = 'hidden';
                                iframe.scrolling = 'no';

 
                                circle.appendChild(iframe);

 
                                circle.style.display = 'flex'; 
                                circle.style.justifyContent = 'center';
                                circle.style.alignItems = 'center'; 
                            });

                            

                            rectangle.addEventListener('mouseleave', () => {
 
                                rectangle.classList.add('waiting-clear');
                            });
                        }



                        bottomRow.appendChild(rectangle);
                    });

                    bottomContainer.appendChild(bottomRow);

 
                    mainContainer.appendChild(topContainer);
                    mainContainer.appendChild(bottomContainer);

 
                    r.appendChild(mainContainer);
                } else {
                    r.style.width = '40px';
                    r.classList.remove('dynamic-content');
                    r.innerHTML = '';
                }
            });
        });
    });

    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.rectangle .dynamic-content')) return;
        rectangles.forEach((r) => {
            r.style.width = '80px';
            r.classList.remove('dynamic-content');
            r.innerHTML = '';
        });
        if (!e.target.closest('.rectangle')) {
            rectangles.forEach(r => {
                r.classList.remove('hide-month'); 
                r.classList.remove('active'); 
            });
    
            isRectangleClicked = false;
        }
    });

    
}

 
initializeRectangles();
