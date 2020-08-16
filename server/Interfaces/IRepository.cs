using CarGoSimulator.Data;
using CarGoSimulator.Models.DBModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace CarGoSimulator.Interfaces
{
    public interface IRepository<T> where T : Entity
    {
        public CarGoSimulatorDBContext Context { get; }

        Task<IEnumerable<T>> GetAllAsync();

        Task<T> GetByIdAsync(string id);

        Task<IEnumerable<T>> GetByConditionAsync(Expression<Func<T, bool>> expression);

        public Task<T> GetFirstByConditionAsync(Expression<Func<T, bool>> expression);

        void Insert(T entity);

        void Update(T entity);

        void Delete(T entity);

        Task ApplyChangesAsync();
    }
}
