import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import apiClient from '../Api/apiClient';
// Composant réutilisable pour chaque carte de statistiques
// J'ai ajusté les classes pour une meilleure responsivité sur différentes tailles d'écran
const StatCard = ({ title, value, icon }) => {
    return (
        <div className="col-xl-3 col-lg-6 col-md-6 mb-4">
            <div className="card shadow-sm h-100">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <p className="card-title text-muted mb-1">{title}</p>
                            <h3 className="fw-bold mb-2">{value}</h3>
                        </div>
                        <div className={`fs-2 text-muted`}>
                            <i className={`bi ${icon}`}></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Composant pour les inscriptions récentes
function RecentRegistrations({ data }) {
    return (
        <div className="card h-100">
            <div className="card-header fw-bold">Student Activity Summary</div>
            <div className="table-responsive">
                <table className="table table-hover mb-0">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>prenom</th>
                            <th>email</th>
                            <th>course enrolled</th>
                             <th>total paid</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((reg,index) => (
                            <tr key={index}>
            <td>{reg.name}</td>
            <td>{reg.prenom}</td>
            <td>{reg.email}</td>
            <td>{reg.courses_enrolled}</td>
            <td>{reg.total_paid.toFixed(2)} DH</td>
        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Composant pour les paiements récents
function RecentPayments({ data }) {
    return (
        <div className="card h-100">
            <div className="card-header fw-bold">Recent Payments</div>
            <div className="table-responsive">
                <table className="table table-hover mb-0">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Amount</th>
                            <th>Course</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((pay) => (
                            <tr key={pay.id}>
                                <td>{pay.etudiant.nom}</td>
                                <td>${pay.montant_paye}</td>
                                <td>{pay.session.cours.titre}</td>
                                <td>{new Date(pay.date_inscription).toLocaleDateString()}</td>
                                <td>{pay.statut}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Graphique des tendances d'inscription (j'ai enlevé la marge `mt-4` pour que la grille la gère)
const EnrollmentTrendsChart = ({ data = [] }) => {
    const monthNames = { '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec' };
    const formattedData = Array.isArray(data) ? data.map(item => ({ name: monthNames[item.month_number] || 'Unknown', count: item.count || 0, year: item.year })) : [];

    return (
        <div className="card h-100">
            <div className="card-header fw-bold">Enrollment Trends</div>
            <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#007bff" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// Graphique de la croissance des revenus (j'ai enlevé la marge `mt-4`)
const RevenueGrowthChart = ({ data }) => {
    const monthNames = { '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec' };
    const formattedData = data.map(item => ({ name: monthNames[item.month_number] || item.month_number, revenue: parseFloat(item.revenue.toFixed(2)) }));

    return (
        <div className="card h-100">
            <div className="card-header fw-bold">Revenue Growth</div>
            <div className="card-body">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={true} />
                        <Tooltip formatter={(value) => [`${value} DH`, 'Revenu']} />
                        <Line type="monotone" dataKey="revenue" stroke="#28a745" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};


// Composant principal qui gère les données et la mise en page
function DashboardStats() {
    const token = localStorage.getItem('token'); 

    // --- Hooks de data fetching (inchangés) ---
    const fetchEtudiant = async () => {
        if (!token) throw new Error("No authentication token found. Please log in.");
        const response = await apiClient.get('/etudiants');
        return response.data;
    };
    const { data: etudiants, isLoading, isError, error } = useQuery({ queryKey: ['etudiants', token], queryFn: fetchEtudiant, enabled: !!token });

    const fetchLastInscription=async()=>{
        const reponse =await apiClient.get('/recentPayement');
        return reponse.data;
    }
    const {data:LastInscription,isError:IserrorLastInscription,isLoading:isLoadingLastInscription}=useQuery({ queryKey:'LastInscription', queryFn:fetchLastInscription });
    const StudentActive=async()=>{
        const response = await apiClient.get('/studentActive');
        return response.data;
    }
    const {data:StudentActivity,isError:StudentActiveError,isLoading:isLoadingActiveStudent}=useQuery({queryKey:'StudentActivity',queryFn:StudentActive})
    
    const fetchCourses = async () => {
        const response = await apiClient.get('/courses');
        return response.data;
    };
    const {data:courses,isError:isErrorCourse,isLoading:isLoadingCourse}=useQuery({ queryFn:fetchCourses, queryKey:'course' });

    const fetchRevenu=async ()=>{
        const response= await apiClient.get('/revenu');
        return response.data;
    }
    const {data:revenu,error:errorRevenu,isError:isErrorRevenu,isLoading:isLoadingRevenu}=useQuery({ queryFn:fetchRevenu, queryKey:'revenu' });
    
    const fetchEnrollmentTrends = async () => {
        const response = await apiClient.get('/stats/enrollment-trends');
        return response.data || [];
    };
    const { data: trendsData = [], isLoading: isLoadingTrends, isError: isErrorTrends } = useQuery({ queryKey: ['trendsData'], queryFn: fetchEnrollmentTrends });

    const fetchRevenueGrowth = async () => {
        const response = await apiClient.get('/stats/revenue-growth');
        return response.data || [];
    };
    const { data: revenueGrowthData = [], isLoading: isLoadingRevenueGrowth, isError: isErrorRevenueGrowth } = useQuery({ queryKey: ['revenueGrowthData'], queryFn: fetchRevenueGrowth });
    
    // --- Logique d'affichage (inchangée) ---
    let RevenuValue = isLoadingRevenu ? <div className="spinner-border spinner-border-sm" role="status"><span className="visually-hidden">Loading...</span></div> : isErrorRevenu ? <span className="text-danger">Erreur</span> : revenu ?Number( revenu.total_revenue.toFixed(2)) + '$' : 'N/A';
    let studentValue = isLoading ? <div className="spinner-border spinner-border-sm" role="status"><span className="visually-hidden">Loading...</span></div> : isError ? <span className="text-danger">Erreur</span> : etudiants ? etudiants.length : 'N/A';
    let courseValue = isLoadingCourse ? <div className="spinner-border spinner-border-sm" role="status"><span className="visually-hidden">Loading...</span></div> : isErrorCourse ? <span className="text-danger">Erreur</span> : courses ? courses.length : 'N/A';

    // --- NOUVELLE MISE EN PAGE JSX ---
    return (
        <div className="container-fluid p-4">
            
            {/* Rangée 1: Cartes de statistiques */}
            <div className="row">
                <StatCard title="Total Students" value={studentValue} icon="bi-people"/>
                <StatCard title="Active Courses" value={courseValue} icon="bi-book"/>
                <StatCard title="Total Revenue" value={RevenuValue} icon="bi-wallet2"/>
                <StatCard title="Upcoming Sessions" value="112" icon="bi-calendar-event"/>
            </div>

            {/* Rangée 2: Inscriptions Récentes & Tendances d'Inscription */}
            <div className="row">
                <div className="col-lg-7 mb-4">
                    {isLoadingActiveStudent ? (
                        <div className="card h-100 justify-content-center align-items-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
                    ) : StudentActiveError ? (
                        <div className="card h-100 justify-content-center align-items-center"><span className="text-danger">Error loading student.</span></div>
                    ) : (
                        <RecentRegistrations data={StudentActivity} />
                    )}
                </div>
                <div className="col-lg-5 mb-4">
                    {isLoadingTrends ? (
                        <div className="card h-100 justify-content-center align-items-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
                    ) : isErrorTrends || !Array.isArray(trendsData) ? (
                        <div className="card h-100 justify-content-center align-items-center"><span className="text-danger">Error loading trends.</span></div>
                    ) : (
                        <EnrollmentTrendsChart data={trendsData} />
                    )}
                </div>
            </div>

            {/* Rangée 3: Paiements Récents & Croissance des Revenus */}
            <div className="row">
                <div className="col-lg-7 mb-4">
                    {isLoadingLastInscription ? (
                        <div className="card h-100 justify-content-center align-items-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
                    ) : IserrorLastInscription ? (
                        <div className="card h-100 justify-content-center align-items-center"><span className="text-danger">Error loading payments.</span></div>
                    ) : (
                        <RecentPayments data={LastInscription} />
                    )}
                </div>
                <div className="col-lg-5 mb-4">
                    {isLoadingRevenueGrowth ? (
                        <div className="card h-100 justify-content-center align-items-center"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>
                    ) : isErrorRevenueGrowth || !Array.isArray(revenueGrowthData) ? (
                        <div className="card h-100 justify-content-center align-items-center"><span className="text-danger">Error loading revenue growth.</span></div>
                    ) : (
                        <RevenueGrowthChart data={revenueGrowthData} />
                    )}
                </div>
            </div>

        </div>
    );
}

export default DashboardStats;