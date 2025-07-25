import React, { useState } from 'react';

const CitationBlock = () => {
  const [copied, setCopied] = useState(false);

  const bibtex = `@article{paradise2024automated,
  title={Automated photo filtering for tourism domain using deep and active learning: the case of Israel},
  author={Paradise-Vit, Abigail and Elyashar, Aviad and Aronson, Yarden},
  journal={Information Technology \\& Tourism},
  volume={26},
  number={3},
  pages={553--582},
  year={2024},
  publisher={Springer}
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(bibtex).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="citation-wrapper">
      <p>If you use <strong>VISTA</strong>  we would appreciate using the following citation:</p>

      <div className="citation-box">
        <pre>
          <code>{bibtex}</code>
        </pre>
        <button className="copy-button" onClick={handleCopy}>
          {copied ? '✓' : '📋'}
        </button>
      </div>
    </div>
  );
};

export default CitationBlock;
