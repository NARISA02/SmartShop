"use client";

import { useState } from "react";

type Product = {
  id: number;
  name: string;
  category?: string;
  price: number;
  cost: number;
  stock: number;
};

export default function Home() {
  const [page, setPage] = useState("dashboard");

  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "โค้ก", price: 20, cost: 14, stock: 8 },
    { id: 2, name: "มาม่า", price: 8, cost: 5, stock: 20 },
    { id: 3, name: "นม", price: 15, cost: 10, stock: 5 },
  ]);

 const [cart, setCart] = useState<(Product & { quantity: number })[]>([]);
  const [searchText, setSearchText] = useState("");

  const [newProduct, setNewProduct] = useState({
    id: 0,
    name: "",
    category: "",
    price: "",
    cost: "",
    stock: "",
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const addToCart = (product: Product) => {
  if (product.stock <= 0) {
    alert("สินค้าหมดแล้ว");
    return;
  }

  const existingItem = cart.find((item) => item.id === product.id);

  if (existingItem) {
    setCart(
      cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  } else {
    setCart([...cart, { ...product, quantity: 1 }]);
  }

  setProducts(
    products.map((item) =>
      item.id === product.id
        ? { ...item, stock: item.stock - 1 }
        : item
    )
  );
};
 const increaseCartItem = (productId: number) => {
  const product = products.find((item) => item.id === productId);

  if (!product || product.stock <= 0) {
    alert("สินค้าหมดแล้ว");
    return;
  }

  setCart(
    cart.map((item) =>
      item.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  );

  setProducts(
    products.map((item) =>
      item.id === productId
        ? { ...item, stock: item.stock - 1 }
        : item
    )
  );
};

const decreaseCartItem = (productId: number) => {
  const cartItem = cart.find((item) => item.id === productId);

  if (!cartItem) return;

  if (cartItem.quantity === 1) {
    setCart(cart.filter((item) => item.id !== productId));
  } else {
    setCart(
      cart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  }

  setProducts(
    products.map((item) =>
      item.id === productId
        ? { ...item, stock: item.stock + 1 }
        : item
    )
  );
};

const removeCartItem = (productId: number) => {
  const cartItem = cart.find((item) => item.id === productId);

  if (!cartItem) return;

  setCart(cart.filter((item) => item.id !== productId));

  setProducts(
    products.map((item) =>
      item.id === productId
        ? { ...item, stock: item.stock + cartItem.quantity }
        : item
    )
  );
};

const addProduct = () => {
  if (!newProduct.name || !newProduct.price || !newProduct.cost || !newProduct.stock) {
    alert("กรุณากรอกข้อมูลสินค้าให้ครบ");
    return;
  }

  if (editingProduct) {
    setProducts(
      products.map((item) =>
        item.id === editingProduct.id
          ? {
              id: editingProduct.id,
              name: newProduct.name,
              category: newProduct.category,
              price: Number(newProduct.price),
              cost: Number(newProduct.cost),
              stock: Number(newProduct.stock),
            }
          : item
      )
    );

    setEditingProduct(null);
  } else {
    const product: Product = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      cost: Number(newProduct.cost),
      stock: Number(newProduct.stock),
    };

    setProducts([...products, product]);
  }

  setNewProduct({
    id: 0,
    name: "",
    category: "",
    price: "",
    cost: "",
    stock: "",
  });

  setPage("products");
};

const checkout = () => {
    if (cart.length === 0) {
      alert("ยังไม่มีสินค้าในตะกร้า");
      return;
    }

    alert("ชำระเงินสำเร็จ");
    setCart([]);
  };
const deleteProduct = (id: number) => {
  const confirmDelete = confirm("ต้องการลบสินค้านี้ใช่ไหม?");

  if (!confirmDelete) {
    return;
  }

  setProducts(products.filter((product) => product.id !== id));
};
const editProduct = (product: Product) => {
  setEditingProduct(product);

  setNewProduct({
    id: product.id,
    name: product.name,
    category: product.category ?? "",
    price: product.price.toString(),
    cost: product.cost.toString(),
    stock: product.stock.toString(),
  });

  setPage("editProduct");
};
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
const profit = cart.reduce(
  (sum, item) => sum + (item.price - item.cost) * item.quantity,
  0
);
  const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(searchText.toLowerCase()) ||
  (product.category ?? "").toLowerCase().includes(searchText.toLowerCase())
);

  return (
    <main className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white shadow p-6">
        <h1 className="text-2xl font-bold text-red-600">🏪ร้านโชห่วยของแพท


        </h1>
        <p className="text-sm text-gray-500 mt-1">ระบบร้านค้าทดลอง</p>

        <div className="mt-8 space-y-3">
          <button onClick={() => setPage("dashboard")} className="w-full text-left bg-blue-600 text-white px-4 py-3 rounded-xl">
            🏠 หน้าหลัก
          </button>
          <button onClick={() => setPage("pos")} className="w-full text-left bg-gray-100 px-4 py-3 rounded-xl">
            🛒 ขายสินค้า
          </button>
          <button onClick={() => setPage("products")} className="w-full text-left bg-gray-100 px-4 py-3 rounded-xl">
          
            📦 สินค้า
          </button>
          <button onClick={() => {
  setEditingProduct(null);
  setPage("addProduct");
}} className="w-full text-left bg-gray-100 px-4 py-3 rounded-xl">
            ➕ เพิ่มสินค้า
          </button>
        </div>
      </aside>

      <section className="flex-1 p-8">
        {page === "dashboard" && (
          <>
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="text-gray-500 mt-1">ภาพรวมร้านวันนี้</p>

            <div className="grid grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold">💰 ยอดขายในตะกร้า</h3>
                <p className="text-3xl text-green-600 mt-4">฿{total}</p>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold">📈 กำไรในตะกร้า</h3>
                <p className="text-3xl text-blue-600 mt-4">฿{profit}</p>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold">📦 สินค้าใกล้หมด</h3>
                <ul className="mt-4">
                  {products
                    .filter((product) => product.stock <= 5)
                    .map((product) => (
                      <li key={product.id}>
                        {product.name} เหลือ {product.stock}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {page === "pos" && (
          <>
            <h2 className="text-3xl font-bold">ขายสินค้า</h2>
            <p className="text-gray-500 mt-1">เลือกสินค้าเพื่อเพิ่มลงตะกร้า</p>

            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold mb-4">สินค้า</h3>

                <div className="space-y-3">
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => addToCart(product)}
                      className="w-full flex justify-between bg-gray-100 hover:bg-gray-200 p-4 rounded-xl"
                    >
                      <span>{product.name} เหลือ {product.stock}</span>
                      <span>฿{product.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="font-bold mb-4">ตะกร้าสินค้า</h3>

                {cart.length === 0 ? (
                  <p className="text-gray-400">ยังไม่มีสินค้า</p>
                ) : (
                  <ul className="space-y-2">
                  {cart.map((item) => (
  <li key={item.id} className="flex items-center justify-between gap-3">
    <div>
      <p>{item.name}</p>
      <p className="text-sm text-gray-500">
        ฿{item.price} x {item.quantity}
      </p>
    </div>

    <div className="flex items-center gap-2">
      <button
        onClick={() => decreaseCartItem(item.id)}
        className="bg-gray-200 px-3 py-1 rounded-lg"
      >
        -
      </button>

      <span>{item.quantity}</span>

      <button
        onClick={() => increaseCartItem(item.id)}
        className="bg-gray-200 px-3 py-1 rounded-lg"
      >
        +
      </button>

      <button
        onClick={() => removeCartItem(item.id)}
        className="text-red-500"
      >
        🗑️
      </button>

      <span className="font-bold">฿{item.price * item.quantity}</span>
    </div>
  </li>
))}
                  </ul>
                )}

                <hr className="my-4" />

                <div className="flex justify-between font-bold text-xl">
                  <span>รวม</span>
                  <span>฿{total}</span>
                </div>

                <div className="flex justify-between text-green-600 mt-2">
                  <span>กำไร</span>
                  <span>฿{profit}</span>
                </div>

                <button
                  onClick={checkout}
                  className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700"
                >
                  ชำระเงิน
                </button>
              </div>
            </div>
          </>
        )}

        {page === "products" && (
          <>
            <h2 className="text-3xl font-bold">คลังสินค้า</h2>
            <p className="text-gray-500 mt-1">รายการสินค้าในร้าน</p>
            <input
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  placeholder="ค้นหาชื่อสินค้า หรือหมวดหมู่..."
  className="w-full border p-3 rounded-xl mt-6"
/>

            <div className="bg-white rounded-xl shadow mt-8 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="text-left p-4">สินค้า</th>
                    <th className="text-left p-4">หมวดหมู่</th>
                    <th className="text-left p-4">ราคาขาย</th>
                    <th className="text-left p-4">ต้นทุน</th>
                    <th className="text-left p-4">สต๊อก</th>
                    <th className="text-left p-4">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-t">
                      <td className="p-4">{product.name}</td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4">฿{product.price}</td>
                      <td className="p-4">฿{product.cost}</td>
                      <td className="p-4">{product.stock}</td>
                      <td className="p-4">
  <button
  onClick={() => editProduct(product)}
  className="mr-3"
>
  🖊️
</button>
  <button onClick={() => deleteProduct(product.id)}>🗑️</button>
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {(page === "addProduct" || page === "editProduct") && (
          <>
            <h2 className="text-3xl font-bold">{editingProduct ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}</h2>
            <p className="text-gray-500 mt-1">กรอกข้อมูลสินค้าใหม่เข้าระบบ</p>

            <div className="bg-white rounded-xl shadow p-6 mt-8 max-w-xl space-y-4">
              <input
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="ชื่อสินค้า เช่น น้ำปลา"
                className="w-full border p-3 rounded-xl"
              />
              <select
  value={newProduct.category}
  onChange={(e) =>
    setNewProduct({ ...newProduct, category: e.target.value })
  }
  className="w-full border p-3 rounded-xl"
>
  <option value="">เลือกหมวดหมู่สินค้า</option>
  <option value="เครื่องดื่ม">🥤 เครื่องดื่ม</option>
  <option value="บะหมี่">🍜 บะหมี่</option>
  <option value="ขนม">🍪 ขนม</option>
  <option value="ของใช้ในบ้าน">🧴 ของใช้ในบ้าน</option>
  <option value="ของใช้ส่วนตัว">🧼 ของใช้ส่วนตัว</option>
</select>

              <input
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder="ราคาขาย เช่น 25"
                type="number"
                className="w-full border p-3 rounded-xl"
              />

              <input
                value={newProduct.cost}
                onChange={(e) => setNewProduct({ ...newProduct, cost: e.target.value })}
                placeholder="ต้นทุน เช่น 18"
                type="number"
                className="w-full border p-3 rounded-xl"
              />

              <input
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                placeholder="จำนวนสต๊อก เช่น 12"
                type="number"
                className="w-full border p-3 rounded-xl"
              />

              <button
                onClick={addProduct}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
              >
               
  {editingProduct ? "บันทึกการแก้ไข" : "บันทึกสินค้า"}
</button>
   
            </div>
          </>
        )}
      </section>
    </main>
  );
}