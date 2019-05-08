using System.Collections.Generic;

namespace PokeR.Core.ViewModels
{
    public class ListChange<T>
    {
        public ListChange() { }
        public ListChange(T delta, List<T> collection)
        {
            Delta = delta;
            Collection = collection;
        }

        public T Delta { get; set; }
        public List<T> Collection { get; set; }
    }
}
