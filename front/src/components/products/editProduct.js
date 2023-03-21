import { useEffect, useState } from "react";
import styles from "../styles.module.css";
import axios from "axios";
import Success from "../success";





export default function EditProduct({ setForceRender, onClose, esNuevo, setMode, id, category, name, price, image, categoriasDisponibles }) {

    // Product data State. Only active when submitting form
    const [product, setProduct] = useState(null);

    const [success, setSuccess] = useState(false);

    const [productImage, setProductImage] = useState("./notFound.jpg");



    useEffect(() => {

        if (image) {

            setProductImage(`${process.env.REACT_APP_URL}/${image.path}`);

        }

    }, [productImage])

    // When submitting form this function sets product state an trigger the useEffect hook
    function handleEditSubmit(e) {

        e.preventDefault();

        const image = document.getElementById("image").files[0];
        console.log(image);

        const formData = new FormData();
        formData.append('name', document.getElementById("name").value);
        formData.append('price', document.getElementById("price").value);
        formData.append('description', "testing");
        formData.append('image', image);
        formData.append('category', document.getElementById("category").value);

        console.log("Created form Data");

        if (esNuevo) {

            console.log("Inside If: NEW PRODUCT");
            console.log(document.getElementById("image").files[0]);

            axios
                .post(`${process.env.REACT_APP_URL}/products`, formData, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then((res) => {
                    setSuccess(true)
                    setMode(false);
                    setForceRender(true);
                    console.log(res);

                })
                .catch(error => console.log(error))
                .finally(() => {
                    console.log("Succedeed")
                })
        }

        else if (!esNuevo) {

            console.log("Inside If: EDIT PRODUCT for id: " + id)

            axios
                .patch(`${process.env.REACT_APP_URL}/products/${id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then((res) => {
                    setSuccess(true)
                    setMode(false);
                    setForceRender(true);
                    console.log(res);
                })
                .catch(error => console.log(error))
                .finally(() => {
                    console.log("Succedeed")
                })
        }
    }

    // Cancel function
    function handleCancelar() {
        setMode(false);
        onClose();
    }

    function handleImage(e) {
        e.preventDefault();
        console.log(e.target.files[0]);
        setProductImage(URL.createObjectURL(e.target.files[0]));
        console.log(productImage);
    }


    return (

        !success ?

            <div className={`${styles.centered} ${styles.someAlert}`} style={{ justifyContent: "center" }}>



                <div>

                    {esNuevo ? <h2>Agregar Producto</h2> : <h2>Editar Producto</h2>}

                    <form id="newProduct" className={styles.boxEmergent} style={{ height: "100%" }} onSubmit={handleEditSubmit} method="post">

                        <div className={`${styles.boxElement} ${styles.boxImage}`}>
                            <label className={styles.boxElement} for="image"><img src={productImage}></img></label>
                            <input id="image" type="file" name="image" style={{ display: "none" }} onChange={handleImage}></input>
                        </div>
                        <div className={`${styles.boxElement} ${styles.boxInputs}`}>
                            <h2>Datos del producto</h2>
                            <div>
                                Nombre: <input className={styles.inputs} style={{ width: "100%" }} id="name" defaultValue={name} type="text" maxLength="20" pattern="([^\s][A-z0-9À-ž\s]+)" required></input>
                            </div>
                            <div>
                                Categoría:
                                <div>
                                    <select style={{ height: "4.6vh", width:"100%" }} id="category" defaultValue={category} type="number" required>

                                        {categoriasDisponibles.map((item, key) => {

                                            return (
                                                <option key={key} value={item._id}>{`${item.number}: ${item.name}`}</option>
                                            )

                                        })}
                                    </select>
                                </div>
                            </div>
                            <div>
                                Precio: <input className={styles.inputs} style={{ width: "100%" }} id="price" defaultValue={price} type="number" maxLength="10" required></input>
                            </div>

                        </div>
                    </form>

                    <div className={styles.buttonSet}>
                        <button className={styles.buttonNo} onClick={handleCancelar}>Cancelar</button>
                        <input className={styles.buttonYes} form="newProduct" type="submit" value="Agregar"></input>
                    </div>
                </div>
            </div>

            :

            <Success operacion="Edicion de producto" setSuccess={setSuccess} setMode={setProduct} onClose={onClose} />


    )
}