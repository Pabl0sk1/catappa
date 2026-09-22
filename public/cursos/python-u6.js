window.CURSOS = window.CURSOS || {};
(CURSOS.python = CURSOS.python || []).push({
titulo: "Programación orientada a objetos",
resumen: "Clases, __init__ y self, métodos especiales, herencia, propiedades, métodos de clase y estáticos, y dataclasses",
nivel: "Intermedio",
color: "#e5bf47",
lecciones: [

{
id:"py6l1",
titulo:"Clases y objetos",
claves:["class define un tipo; __init__ inicializa cada objeto; self es el propio objeto","Atributos de instancia frente a atributos de clase","Convención _nombre para uso interno; no hay private real"],
pasos:[
 {t:"info", eti:"Modelar", h:"Una clase",
  c:`<div class="termbox">class Cuenta:
    comision = 0.01                      # atributo de clase (compartido)

    def __init__(self, titular: str, saldo: float = 0):
        self.titular = titular           # atributos de instancia
        self._saldo = saldo              # _ = "no lo toques desde fuera"

    def ingresar(self, importe: float) -&gt; None:
        if importe &lt;= 0:
            raise ValueError("Importe no válido")
        self._saldo += importe

    @property
    def saldo(self) -&gt; float:           # se lee como atributo: cuenta.saldo
        return self._saldo

c = Cuenta("Ana")
c.ingresar(100)
c.saldo      # 100</div>
     <p>A diferencia de Java, <code>self</code> se escribe explícitamente como primer parámetro de cada método.</p>`},
 {t:"par", p:"Empareja cada elemento con su función",
  pares:[["__init__","Inicializa el objeto al crearlo"],["self","Referencia al propio objeto"],["@property","Método que se lee como un atributo"],["_saldo","Convención: atributo interno"],["Atributo de clase","Valor compartido por todas las instancias"]],
  why:"__saldo (dos guiones) activa el «name mangling», pero sigue sin ser privado de verdad."},
 {t:"opcion", p:"¿Qué falta en <code>def ingresar(importe):</code> dentro de una clase?",
  ops:["Nada","El parámetro self: los métodos de instancia lo reciben como primer argumento","Un return","La palabra public"],
  ok:1, why:"Al llamar c.ingresar(100), Python pasa c como self automáticamente."},
 {t:"vf", p:"Python impide acceder desde fuera a un atributo que empieza por guion bajo.",
  ok:false, why:"Es una convención entre programadores, no una restricción del lenguaje."}
]},

{
id:"py6l2",
titulo:"Métodos especiales y herencia",
claves:["Métodos dunder: __repr__, __str__, __eq__, __len__, __iter__...","Herencia con class Hija(Padre) y super()","@classmethod para constructores alternativos; @staticmethod para utilidades"],
pasos:[
 {t:"info", eti:"Integrarse con Python", h:"Métodos especiales",
  c:`<div class="termbox">class Carrito:
    def __init__(self):
        self.items = []
    def __len__(self):                    # len(carrito)
        return len(self.items)
    def __iter__(self):                   # for item in carrito
        return iter(self.items)
    def __contains__(self, x):            # x in carrito
        return x in self.items
    def __repr__(self):                   # representacion para depurar
        return f"Carrito({self.items!r})"

class Empleado:
    def __init__(self, nombre, salario):
        self.nombre, self.salario = nombre, salario
    def pago(self):
        return self.salario

class Gerente(Empleado):
    def __init__(self, nombre, salario, bonus):
        super().__init__(nombre, salario)
        self.bonus = bonus
    def pago(self):
        return super().pago() + self.bonus

    @classmethod
    def desde_dict(cls, d):               # constructor alternativo
        return cls(d["nombre"], d["salario"], d.get("bonus", 0))</div>`},
 {t:"par", p:"Empareja cada método especial con cuándo se llama",
  pares:[["__repr__","Al mostrar el objeto en la consola o al depurar"],["__eq__","Al comparar con =="],["__len__","Al llamar a len(objeto)"],["__iter__","Al recorrerlo con for"],["__enter__ / __exit__","Al usarlo con with"]],
  why:"Implementar estos métodos hace que tus clases se comporten como tipos nativos."},
 {t:"opcion", p:"¿Qué diferencia hay entre @classmethod y @staticmethod?",
  ops:["Ninguna","classmethod recibe la clase (cls) y sirve para constructores alternativos; staticmethod no recibe ni la clase ni la instancia","staticmethod es más rápido","classmethod es privado"],
  ok:1, why:"Ejemplo clásico: datetime.fromisoformat(...) es un classmethod."}
]},

{
id:"py6l3",
titulo:"dataclasses",
claves:["@dataclass genera __init__, __repr__ y __eq__ a partir de los atributos anotados","frozen=True para objetos inmutables; field(default_factory=list) para listas","Equivalente a los records de Java"],
pasos:[
 {t:"info", eti:"Menos código", h:"@dataclass",
  c:`<div class="termbox">from dataclasses import dataclass, field
from datetime import date

@dataclass
class Tarea:
    titulo: str
    hecha: bool = False
    etiquetas: list[str] = field(default_factory=list)   # nunca = [] (trampa mutable)
    limite: date | None = None

@dataclass(frozen=True)
class Dinero:
    cantidad: int          # en centimos
    moneda: str = "EUR"

t = Tarea("Repasar Python")
print(t)                   # Tarea(titulo='Repasar Python', hecha=False, etiquetas=[], limite=None)
Dinero(500) == Dinero(500) # True</div>`},
 {t:"par", p:"Empareja cada opción con su efecto",
  pares:[["@dataclass","Genera __init__, __repr__ y __eq__"],["frozen=True","Objeto inmutable (y usable como clave)"],["field(default_factory=list)","Una lista nueva para cada instancia"],["order=True","Permite comparar con < y >"]],
  why:"Para datos que vienen de fuera y hay que validar, pydantic va un paso más allá."},
 {t:"vf", p:"En una dataclass se puede escribir <code>etiquetas: list = []</code> sin problemas.",
  ok:false, why:"Python lo rechaza precisamente por la trampa del valor mutable: usa field(default_factory=list)."}
]},

{
id:"py6l4",
titulo:"Enums, clases abstractas y protocolos",
claves:["Enum para conjuntos cerrados de valores","abc.ABC y @abstractmethod obligan a implementar métodos","Duck typing: si tiene los métodos, sirve; Protocol lo formaliza para el tipado"],
pasos:[
 {t:"info", eti:"Contratos", h:"Enum, ABC y Protocol",
  c:`<div class="termbox">from enum import Enum, StrEnum
from abc import ABC, abstractmethod
from typing import Protocol

class Estado(StrEnum):
    PENDIENTE = "pendiente"
    PAGADO = "pagado"
    ENVIADO = "enviado"

class PasarelaPago(ABC):
    @abstractmethod
    def cobrar(self, importe: int) -&gt; str: ...

class Stripe(PasarelaPago):
    def cobrar(self, importe):
        return "tx_123"

PasarelaPago()        # TypeError: no se puede instanciar una clase abstracta

class TieneNombre(Protocol):       # tipado estructural
    nombre: str

def saludar(x: TieneNombre) -&gt; str:
    return f"Hola, {x.nombre}"</div>`},
 {t:"par", p:"Empareja cada herramienta con su uso",
  pares:[["Enum / StrEnum","Valores cerrados como estados de un pedido"],["ABC con @abstractmethod","Clase base que obliga a implementar métodos"],["Protocol","Interfaz por forma, sin herencia (duck typing tipado)"],["Duck typing","Si se comporta como un pato, se usa como un pato"]],
  why:"Protocol es el equivalente pythónico de una interface de Java."},
 {t:"opcion", p:"¿Qué pasa si una subclase de una ABC no implementa un método abstracto?",
  ops:["Nada","Error al intentar crear una instancia de la subclase","Se hereda uno vacío","Error de sintaxis al definirla"],
  ok:1, why:"El error aparece al instanciar, no al definir la clase."}
]}

]});
