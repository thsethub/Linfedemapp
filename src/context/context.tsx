import React, { createContext, useState, ReactNode, useContext } from 'react';

interface MeasurementContextProps {
  pontosRef: "5cm" | "7cm" | "10cm";
  setPontosRef: (value: "5cm" | "7cm" | "10cm") => void;
  comprimentoRef: string;
  setComprimentoRef: (value: string) => void;
  selectedValue: string | null;
  setSelectedValue: (value: string | null) => void;
  inputs: string[];
  setInputs: (value: string[]) => void;
  affectedInputs: string[];
  setAffectedInputs: (value: string[]) => void;
  affectedComprimentoRef: string;
  setAffectedComprimentoRef: (value: string) => void;
  differences: number[];
  setDifferences: (value: number[]) => void;
}

const MeasurementContext = createContext<MeasurementContextProps | undefined>(undefined);

export const MeasurementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pontosRef, setPontosRef] = useState<"5cm" | "7cm" | "10cm">("5cm");
  const [comprimentoRef, setComprimentoRef] = useState("0");
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [inputs, setInputs] = useState<string[]>(Array(9).fill(""));
  const [affectedInputs, setAffectedInputs] = useState<string[]>(Array(9).fill(""));
  const [affectedComprimentoRef, setAffectedComprimentoRef] = useState("0");
  const [differences, setDifferences] = useState<number[]>([]);

  return (
    <MeasurementContext.Provider value={{ pontosRef, setPontosRef, comprimentoRef, setComprimentoRef, selectedValue, setSelectedValue, inputs, setInputs, affectedInputs, setAffectedInputs, affectedComprimentoRef, setAffectedComprimentoRef, differences, setDifferences }}>
      {children}
    </MeasurementContext.Provider>
  );
};

export const useMeasurementContext = () => {
  const context = useContext(MeasurementContext);
  if (!context) {
    throw new Error('useMeasurementContext must be used within a MeasurementProvider');
  }
  return context;
};