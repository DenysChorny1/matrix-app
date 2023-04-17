import React, { useEffect, useState } from 'react';
import './App.css';

type Cell = {
  id: number;
  amount: number;
  color: string
}

type MatrixProps = {
  m: number;
  n: number;
  x: number;
}

const Matrix: React.FC<MatrixProps> = ({ m, n, x }) => {
    const [matrix, setMatrix] = useState<Cell[][]>([]);
    const [rowHovered, setRowHovered] = useState<number | null>(null);
    const [percentHovered, setPercentHovered] = useState<number | null>(null);
   
    useEffect(() => {
      const newMatrix: Cell[][] = [];
      for (let i = 0; i < m; i++) {
        const row: Cell[] = [];
        for (let j = 0; j < n; j++) {
          row.push({
            id: i * n + j,
            amount: Math.floor(Math.random() * 100) + 10,
            color: ''
          });
        }
        newMatrix.push(row);
      }
      setMatrix(newMatrix);
    }, [m, n]);
  
    useEffect(() => {
        if (rowHovered !== null) {
            const flattenedMatrix = matrix.flat();
            flattenedMatrix.sort((a,b)=> a.amount - b.amount)
            const index = flattenedMatrix.findIndex(item => item.amount === rowHovered);
            const closestResult = flattenedMatrix.slice(index - Math.floor(x/2), index + Math.floor(x/2));
    
            const updatedMatrix = matrix.map(row => {
                return row.map(cell => {
                    if (closestResult.some(near => near.amount === cell.amount)) {
                        return { ...cell, color: "red" };
                    } else {
                        return { ...cell, color: "white" };
                    }
                });
            });
            setMatrix(updatedMatrix);
        }
    }, [rowHovered, matrix, x]);
      
    const handleCellClick = (rowIndex: number, cellIndex: number) => {
      const newMatrix = [...matrix];
      newMatrix[rowIndex][cellIndex].amount += 1;
      setMatrix(newMatrix);
    };
  
    const addRow = () => {
        const newRow: Cell[] = [];
        for (let i = 0; i < n; i++) {
          newRow.push({
            id: matrix.length * n + i,
            amount: Math.floor(Math.random() * 100) + 10,
            color: ''
          });
        }
        setMatrix(matrix.concat([newRow]));
      };
    
    const removeRow = (rowIndex: number) => {
        const newMatrix = [...matrix];
        newMatrix.splice(rowIndex, 1);
        setMatrix(newMatrix);
    };

    const sumRow = (row: Cell[]) => {
        return row.reduce((sum, cell) => sum + cell.amount, 0);
    };
  
    const averagColumn = (matrix: Cell[][], colIndex: number): number => {
        let averag = 0;
        for (let i = 0; i < matrix.length; i++) {
            const cell = matrix[i][colIndex];
            if (cell !== undefined && cell.amount !== undefined) {
                averag += cell.amount/m;
            }
        }
        return averag;
    };

    const handleRowHover = (cell: number) => {
        setRowHovered(cell);
    };
    
    const handlePercentHover = (cell: number, sum: number) => {
        const percentage = ((cell/sum)*100)
        setPercentHovered(Math.round(percentage));
    };

    const handleRowLeave = () => {
        setRowHovered(null);
    };
    
    const rowSums = matrix.map((row) => sumRow(row));
    const columnAverage = [...Array(n)].map((_, i) => averagColumn(matrix, i));
    const totalSum = rowSums.reduce((sum, val) => sum + val, 0);
  
    return (
      <table>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={cell.id}
                    onClick={() => handleCellClick(i, j)}
                    onMouseEnter={() => {
                        handleRowHover(cell.amount)
                        handlePercentHover(cell.amount, rowSums[i])
                    }}
                    onMouseLeave={handleRowLeave}
                    style={{ backgroundColor: cell.color }}>
                  {cell.amount}
                  <span className='percentage'>{percentHovered}%</span>
                </td>
              ))}
              <td>{rowSums[i]}</td>
              <td>
                <button onClick={() => removeRow(i)}>Delete Row</button>
              </td>
            </tr>
          ))}
          <tr>
            {columnAverage.map((sum, i) => (
              <td key={i}>{sum.toFixed(1)}</td>
            ))}
             
            <td>{totalSum}</td>
          </tr>
          <button onClick={() => addRow()}>Add Row</button>
        </tbody>
      </table>
    );
  };

const App = () => {
  const [m, setM] = useState(0);
  const [n, setN] = useState(0);
  const [x, setX] = useState(0);

  const handleChangeM = (e: React.ChangeEvent<HTMLInputElement>) => {
    setM(parseInt(e.target.value));
  };

  const handleChangeN = (e: React.ChangeEvent<HTMLInputElement>) => {
    setN(parseInt(e.target.value));
  };

  const handleChangeX = (e: React.ChangeEvent<HTMLInputElement>) => {
    setX(parseInt(e.target.value));
  };

  return (
    <div className='container'>
      <div className='box'>
        <label htmlFor="m">M:</label>
        <input min={0} max={100} type="number" id="m" value={m} onChange={handleChangeM} />
      </div>
      <div className='box'>
        <label htmlFor="n">N:</label>
        <input min={0} max={100} type="number" id="n" value={n} onChange={handleChangeN} />
      </div>
      <div className='box'>
        <label htmlFor="x">X:</label>
        <input min={0} max={100} type="number" id="x" value={x} onChange={handleChangeX} />
      </div>
      {m > 0 && n > 0 && <Matrix m={m} n={n} x={x} />}
    </div>
  );
};

export {App};
