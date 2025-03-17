import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const productosDisponibles = ["ZAPALLO", "APIO", "NABO", "ZANAHORIA", "TOMATE", "LECHUGA", "PEPINO", "LIMON", "AJI AMARILLO", "PIMENTON"];
const tiposDisponibles = ["VERDURAS", "HIERBAS", "CARNES", "FRUTAS", "ABARROTES", "OTROS"];
const unidadesDisponibles = ["UNID", "KILOGRAMO", "ATADO", "UNIDAD", "BOLSA", "CAJÓN", "PAQUETE", "CAJA", "PLANCHA", "SACO", "FRASCO", "GALÓN"];

const FormularioRequerimiento = () => {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    fecha: "",
    tipo: "",
    descripcion: "",
    unidad: "",
    cantidad: "",
    observaciones: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const agregarProducto = () => {
    if (nuevoProducto.fecha && nuevoProducto.tipo && nuevoProducto.descripcion && nuevoProducto.unidad && nuevoProducto.cantidad) {
      setProductos((prev) => [...prev, nuevoProducto]);
      setNuevoProducto({ fecha: "", tipo: "", descripcion: "", unidad: "", cantidad: "", observaciones: "" });
    } else {
      alert("Por favor, complete todos los campos obligatorios.");
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Requerimiento de Insumos", 20, 10);
    autoTable(doc, {
      head: [["Fecha", "Tipo", "Descripción", "Unidad", "Cantidad", "Observaciones"]],
      body: productos.map((p) => [p.fecha, p.tipo, p.descripcion, p.unidad, p.cantidad, p.observaciones]),
    });
    doc.save("requerimiento.pdf");
  };

  const exportarExcel = () => {
    const ws = XLSX.utils.json_to_sheet(productos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Requerimiento");
    XLSX.writeFile(wb, "requerimiento.xlsx");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Formulario de Requerimiento</h2>
      <div className="grid grid-cols-6 gap-2 mb-4">
        <input type="date" name="fecha" value={nuevoProducto.fecha} onChange={handleChange} className="border p-2" required />
        <select name="tipo" value={nuevoProducto.tipo} onChange={handleChange} className="border p-2" required>
          <option value="">Tipo</option>
          {tiposDisponibles.map((tipo) => (
            <option key={tipo} value={tipo}>{tipo}</option>
          ))}
        </select>
        <select name="descripcion" value={nuevoProducto.descripcion} onChange={handleChange} className="border p-2" required>
          <option value="">Producto</option>
          {productosDisponibles.map((producto) => (
            <option key={producto} value={producto}>{producto}</option>
          ))}
        </select>
        <select name="unidad" value={nuevoProducto.unidad} onChange={handleChange} className="border p-2" required>
          <option value="">Unidad</option>
          {unidadesDisponibles.map((unidad) => (
            <option key={unidad} value={unidad}>{unidad}</option>
          ))}
        </select>
        <input type="number" name="cantidad" placeholder="Cantidad" value={nuevoProducto.cantidad} onChange={handleChange} className="border p-2" required />
        <input type="text" name="observaciones" placeholder="Observaciones" value={nuevoProducto.observaciones} onChange={handleChange} className="border p-2" />
      </div>
      <Button onClick={agregarProducto}>Agregar Producto</Button>
      <Table className="mt-4">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Descripción</th>
            <th>Unidad</th>
            <th>Cantidad</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p, index) => (
            <tr key={index}>
              <td>{p.fecha}</td>
              <td>{p.tipo}</td>
              <td>{p.descripcion}</td>
              <td>{p.unidad}</td>
              <td>{p.cantidad}</td>
              <td>{p.observaciones}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="mt-4 flex gap-2">
        <Button onClick={exportarPDF}>Exportar PDF</Button>
        <Button onClick={exportarExcel}>Exportar Excel</Button>
      </div>
    </div>
  );
};

export default FormularioRequerimiento;
